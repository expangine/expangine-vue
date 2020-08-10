import { Type, Expression, Types, ObjectType, isArray, isObject, DefinitionProvider, isFunction, Runtime, isString } from 'expangine-runtime';
import { LiveContext, LiveRuntimeImpl } from 'expangine-runtime-live';


interface ComponentValue<A, E, S extends string, V extends keyof A> {
    type: Type;
    default?: Expression;
    changed?: (value: A[V], instance: ComponentInstance<A, E, S>, e: HTMLElement) => void;
    initial?: (value: A[V], instance: ComponentInstance<A, E, S>, e: HTMLElement) => void;
    update?: (value: A[V], instance: ComponentInstance<A, E, S>, e: HTMLElement) => void;
}

interface ComponentInstance<A, E, S extends string> {
    component: Component<A, E, S>;
    cache: Record<string, any>;
    get<V extends keyof A>(value: V, defaultValue?: A[V]): A[V];
    trigger<K extends keyof E>(eventName: K, payload: E[K]): void;
    update(): void;
    render(): void;
}

type ComponentTemplateTag = string | Expression;
type ComponentTemplateValues = Record<string, Expression | any>; // when value is Expression, that expression is watched
type ComponentTemplateEvents = Record<string, Expression | ((payload: any) => any)>;
type ComponentTemplateSlots = Record<string, Array<string | ComponentTemplate>>;

type ComponentTemplate = [
    ComponentTemplateTag,
    ComponentTemplateValues?,
    ComponentTemplateEvents?,
    ComponentTemplateSlots?
];

interface ComponentBase<A, E = never, S extends string = never> {
  ref?: string;
  name: string;
  collection: string;
  state?: ObjectType;
  render: (instance: ComponentInstance<A, E, S>) => ComponentTemplate;
  created?: (instance: ComponentInstance<A, E, S>, e: HTMLElement) => void;
  updated?: (instance: ComponentInstance<A, E,S>, e: HTMLElement) => void;
  destroyed?: (instance: ComponentInstance<A, E, S>, e: HTMLElement) => void;
}

type Component<A = never, E = never, S extends string = never> = 
  ComponentBase<A, E, S> & 
  ( [A] extends [never] ? {} : { attributes: { [V in keyof A]: ComponentValue<A, E, S, V> | Type } } ) & 
  ( [E] extends [never] ? {} : { events: { [K in keyof E]: Type } } ) & 
  ( [S] extends [never] ? {} : { slots: { [L in S]: ObjectType /* scope added to context */ } } );


interface ComponentVisuals<A = never, E = never, S extends string = never> {
    collection: string;
    category: string;
    name: string;
    description: string;
    attributes: { [K in keyof A]: string };
    events: { [K in keyof E]: string };
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
 * [':slot, { name: string }, {}, 
 *  [...defaultValue]
 * ]
 * 
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
 * 
 * ComponentType = object with attribute and local component state
 * 
 * 
 * Solve
 * - how will user-defined components trigger an event?
 * 
 * 
 */

const components: Record<string, Component> = {};

interface ComponentScope {
    parent?: ComponentScope;
    watch(expr: Expression, listener: (value: any) => void): void;
    child(): ComponentScope;
    context: LiveContext;
}

type ComponentCompiler = (template: ComponentTemplate, scope: ComponentScope, defs: DefinitionProvider, run: Runtime) => HTMLElement;


function getCompiler(template: ComponentTemplate): ComponentCompiler {
    return CompileDom;
} 

const CompileDom: ComponentCompiler = (template, parentScope, defs, run) => {
    const [tag, attrs, events, children] = template;
    const e = document.createElement(tag as any) as HTMLElement;
    const scope = parentScope.child();

    if (isObject(attrs)) {
        for (const attr in attrs) {
            const attrValue = attrs[attr];

            if (isArray(attrValue)) {
                const expr = defs.getExpression(attrValue);

                scope.watch(expr, (v) => {
                    (e as any)[attr] = v;
                });
            } else {
                (e as any)[attr] = attrValue;
            }
        }
    }

    if (isObject(events)) {
        for (const ev in events) {
            const eventValue = events[ev];

            if (isFunction(eventValue)) {
                e.addEventListener(ev, eventValue);
            }
            else if (isArray(eventValue)) { 
                const expr = defs.getExpression(eventValue);

                e.addEventListener(ev, (nativeEvent) => {
                    run.run(expr, scope.context);
                });
            }
        }
    }

    if (children && children.default) {
        const child = children.default;
        const childs = isArray(child) ? child : [child];

        for (const childTemplate of childs) { 
            if (isString(childTemplate)) {
                e.append(childTemplate);
            } else {
                const childElement = getCompiler(childTemplate)(childTemplate, scope, defs, run);
                // when element changes because tag is dynamic, update child
                e.appendChild(childElement);

            }
            
        }
    }

    return e;
};
