import { Type, Expression, Types, ObjectType } from 'expangine-runtime';


interface ComponentValue<C, E, V extends keyof C> {
    type: Type;
    default?: Expression;
    changed?: (value: C[V], instance: ComponentInstance<C, E>, e: HTMLElement) => void;
    initial?: (value: C[V], instance: ComponentInstance<C, E>, e: HTMLElement) => void;
    update?: (value: C[V], instance: ComponentInstance<C, E>, e: HTMLElement) => void;
}

interface ComponentInstance<C, E, S extends string> {
    component: Component<C, E, S>;
    cache: Record<string, any>;
    get<V extends keyof C>(value: V, defaultValue?: C[V]): C[V];
    trigger<P extends keyof E>(eventName: P, payload: E[P]): void;
    update(): void;
    render(): void;
}

type ComponentTemplateTag = string | Expression;
type ComponentTemplateValues = Record<string, Expression | any>; // when value is Expression, that expression is watched
type ComponentTemplateEvents = Record<string, Expression | ((payload: any) => any)>;
type ComponentTemplateSlots = Record<string, string | ComponentTemplate | Array<string | ComponentTemplate>>;

type ComponentTemplate = [
    ComponentTemplateTag,
    ComponentTemplateValues?,
    ComponentTemplateEvents?,
    ComponentTemplateSlots?
];

interface ComponentBase<C, E = never, S extends string = never> {
  ref?: string;
  name: string;
  collection: string;
  render: (instance: ComponentInstance<C, E, S>) => ComponentTemplate;
  created?: (instance: ComponentInstance<C, E, S>, e: HTMLElement) => void;
  updated?: (instance: ComponentInstance<C, E,S>, e: HTMLElement) => void;
  destroyed?: (instance: ComponentInstance<C, E, S>, e: HTMLElement) => void;
}

type Component<C = never, E = never, S extends string = never> = 
  ComponentBase<C, E, S> & 
  ( [C] extends [never] ? {} : { attributes: { [V in keyof C]: ComponentValue<C, E, V> | Type } } ) & 
  ( [E] extends [never] ? {} : { events: { [P in keyof E]: Type } } ) & 
  ( [S] extends [never] ? {} : { slots: { [L in S]: ObjectType /* scope added to context */ } } );


interface ComponentVisuals<C = never, E = never, S extends string = never> {
    collection: string;
    category: string;
    name: string;
    description: string;
    attributes: { [V in keyof C]: string };
    events: { [V in keyof E]: string };
    slots: { [P in S]: string };
}

interface ComponentCollection {
    name: string;
    dependentStyles: string[];
    dependentCode: string[];
    components: Component<any>;
}



const google: any = null;


export const HtmlInput: Component<{
    type: string,
    value: string,
}> = {
    name: 'input',
    collection: 'html',
    attributes: {
        type: Types.enumForText(['text', 'password', 'number', 'date']),
        value: Types.text(),
    },
    render: (i) => ['input', {
        type: i.get('type'),
        value: i.get('value'),
    }],
};

// googlecharts/pie
export const PieChart: Component<{
    title: string,
    label: string,
    value: string,
    data: Array<{label: string, value: number, color?: string, offset?: number}>,
}, { 
    updated: null,
}> = {
    name: 'pie',
    collection: 'googlecharts',
    attributes: {
        title: Types.text(),
        label: Types.text(),
        value: Types.text(),
        data: Types.list(Types.object({ 
                label: Types.text(), 
                value: Types.number(),
                color: Types.optional(Types.color()),
                offset: Types.number(0, 1),
        })),
    },
    events: {
        updated: Types.null(),
    },
    render: () => ['div'],
    created: (i, e) => {
        i.update();
    },
    updated: (i, e) => {
        const chart = i.cache.chart || new google.visualization.PieChart(e);
        const [data, label, value, title] = [i.get('data'), i.get('label'), i.get('value'), i.get('title')];
        const chartData = ([[label, value]] as Array<[string, any]>).concat(data.map((p) => [p.label, p.value]));

        const options = {
            title,
            slices: {} as any,
        };

        data.forEach((point, pointIndex) => {
            options.slices[pointIndex] = {
                offset: point.offset,
                color: point.color,
            };
        });

        chart.draw(chartData, options);

        i.cache.chart = chart;
        i.cache.options = options;

        i.trigger('updated', null);
    },
};

/**
 * 
 * ['googlecharts/pie', 
 *      { title: 'Hello World', data: [], value: 'Tasks', label: 'Person' }, 
 *      { updated: () => {} },
 * ]
 * 
 * special
 * 
 * [':for', { items: Expression, item: string, index: string, key: Expression }, { },
 *  [...childTemplate]
 * ]
 * [':if, { condition: Expression }, {}, 
 *  [...children]
 * ]
 * [':show, { condition: Expression }, {}, 
 *  [...children]
 * ]
 * [':hide, { condition: Expression }, {}, 
 *  [...children]
 * ]
 * 
 * context in components
 * { 
 *   page: Type (defined for interface),
 *   refs: {
 *     [ref]: ComponentType
 *   },
 *   this: ComponentType (for current component)
 *   item & index if in :for
 * }
 * 
 * ComponentType = object with attribute and local component state
 * 
 */
