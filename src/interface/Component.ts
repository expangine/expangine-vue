import { Type, Expression, Types } from "expangine-runtime";

interface ComponentValue<C, E, V extends keyof C> {
    type: Type;
    default?: Expression;
    changed?: (value: C[V], instance: ComponentInstance<C, E>, e: HTMLElement) => void;
    initial?: (value: C[V], instance: ComponentInstance<C, E>, e: HTMLElement) => void;
    update?: (value: C[V], instance: ComponentInstance<C, E>, e: HTMLElement) => void;
}

interface ComponentInstance<C, E> {
    component: Component<C, E>;
    cache: Record<string, any>;
    get<V extends keyof C>(value: V, defaultValue?: C[V]): C[V];
    get<V extends C>(value: C): C;
    update(): void;
    rerender(): void;
    trigger<P extends keyof E>(eventName: P, payload: E[P]): void;
}

type ComponentTemplateTag = string | Expression;
type ComponentTemplateValues = Record<string, any>;
type ComponentTemplateEvents = Record<string, (payload: any) => any>;
type ComponentTemplateSlots = Record<string, string | ComponentTemplate | Array<string | ComponentTemplate>>;

type ComponentTemplate = [
    ComponentTemplateTag,
    ComponentTemplateValues?,
    ComponentTemplateEvents?,
    ComponentTemplateSlots?
];

interface Component<C, E = never, S extends string = never> {
    name: string;
    collection: string;
    values: { [V in keyof C]: ComponentValue<C, E, V> | Type };
    events: [E] extends [never] ? never : { [P in keyof E]: Type };
    slots: [S] extends [never] ? never: { [L in S]: Type }
    render: (instance: ComponentInstance<C, E>) => ComponentTemplate;
    created?: (instance: ComponentInstance<C, E>, e: HTMLElement) => void;
    updated?: (instance: ComponentInstance<C, E>, e: HTMLElement) => void;
    destroyed?: (instance: ComponentInstance<C, E>, e: HTMLElement) => void;
}

interface ComponentVisuals<C> {
    collection: string;
    name: string;
    description: string;
    category: string;
    values: { [V in keyof C]: string },
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
    values: {
        type: Types.enumForText(['text', 'password', 'number', 'date']),
        value: Types.text(),
    },
    render: (i) => ['input', {
        type: i.get('type'),
        value: i.get('value')
    }],
};

// googlecharts/pie
export const PieChart: Component<{
    title: string,
    label: string,
    value: string,
    data: Array<{label: string, value: number, color?: string, offset?: number}>,
}, { 
    updated: null 
}> = {
    name: 'pie',
    collection: 'googlecharts',
    values: {
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
        const { data, label, value, title } = i.get({ data: [], label: '', value: '', title: ''});
        const chartData = ([[label, value]] as Array<[string, any]>).concat(data.map(p => [p.label, p.value]))

        const options = {
            title: title,
            slices: {} as any,
        };

        data.forEach((point, pointIndex) => {
            options.slices[pointIndex] = {
                offset: point.offset,
                color: point.color
            };
        });

        chart.draw(chartData, options);

        i.cache.chart = chart;
        i.cache.options = options;

        i.trigger('updated', null);
    },
}

/**
 * 
 * ['googlecharts/pie', 
 *      { title: 'Hello World', data: [], value: 'Tasks', label: 'Person' }, 
 *      { updated: () => {} },
 * ]
 * 
 */