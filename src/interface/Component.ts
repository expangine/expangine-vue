import { Type, Expression, Types, ObjectType, isArray, isObject, isFunction, isString } from 'expangine-runtime';
import { LiveContext, LiveRuntime } from 'expangine-runtime-live';



// expangine-vue

export interface ComponentVisuals<A = never, E = never, S extends string = never> {
    collection: string;
    category: string;
    name: string;
    description: string;
    attributes: { [K in keyof A]: string };
    events: { [K in keyof E]: string };
    slots: { [P in S]: { description: string, scope: Record<string, string> } };
}

export interface ComponentCollection {
    name: string;
    dependentStyles: string[];
    dependentCode: string[];
    components: Component<any>;
}



// expangine-inteface

export interface ComponentValue<A, E, S extends string, V extends keyof A> {
    type: Type;
    default?: Expression;
    changed?: (value: A[V], instance: ComponentInstance<A, E, S>, e: Node) => void;
    initial?: (value: A[V], instance: ComponentInstance<A, E, S>, e: Node) => void;
    update?: (value: A[V], instance: ComponentInstance<A, E, S>, e: Node) => void;
}

export interface ComponentInstance<A, E, S extends string> {
    component: Component<A, E, S>;
    cache: Record<string, any>;
    context: LiveContext;
    node?: NodeInstance;
    parent?: ComponentInstance<any, any, any>;
    slots?: NodeTemplateNamedSlots;
    get<V extends keyof A>(attr: V, defaultValue?: A[V]): A[V];
    set<V extends keyof A>(attr: V, value: A[V]): void;
    trigger<K extends keyof E>(eventName: K, payload: E[K]): void;
    on<K extends keyof E>(eventName: K, listener: (payload: E[K]) => any): Off;
    watch(expr: any, onValue: (value: any) => void): Off;
    eval(expr: any): (extra?: any) => any;
    update(): void;
    render(): void;
}

export function newComponentInstance(component: Component<any, any, any>, slots?: NodeTemplateNamedSlots, parent?: ComponentInstance<any, any, any>): ComponentInstance<any, any, any> {

    const listeners: Record<string, Array<(payload: any) => any>> = Object.create(null);

    const instance: ComponentInstance<any, any, any> = {
        component,
        cache: {},
        context: {},
        parent,
        slots,
        get: (attr: any, defaultValue?: any): any => {
            return instance.context[attr];
        },
        set: (attr: any, value: any): void => {
            instance.context[attr] = value;
        },
        trigger: (eventName: any, payload: any): void => {
            if (eventName in listeners) {
                listeners[eventName].forEach((l) => l(payload));
            }
        },
        on: (eventName: any, listener: (payload: any) => any): Off => {
            if (!(eventName in listeners)){ 
                listeners[eventName] = [];
            }
            listeners[eventName].push(listener);

            return () => {
                const i = listeners[eventName].indexOf(listener);
                if (i !== -1) {
                    listeners[eventName].splice(i, 1);
                }
            };
        },
        watch: (expr: any, onValue: (value: any) => void): Off => {
            const cmd = LiveRuntime.eval(expr);

            onValue(cmd(instance.context));

            return () => { /* not empty */ };
        },
        eval: (expr: any): ((extra?: any) => any) => {
            const cmd = LiveRuntime.eval(expr);

            return (extra) => cmd(extra ? { ...instance.context, ...extra} : instance.context);
        },
        update: (): void => {
            if (instance.component.updated && instance.node) {
                instance.component.updated(instance, instance.node.element);
            }
        },
        render: (): void => {
            /* not empty */
        },
    };

    return instance;
}

export type Off = () => void;
export type NodeTemplateTag = string | Expression;
export type NodeTemplateValues = Record<string, Expression | any>; // when value is Expression, that expression is watched
export type NodeTemplateEvents = Record<string, Expression | any | ((payload: any) => any)>;
export type NodeTemplateChild = string | NodeTemplate | Expression;
export type NodeTemplateNamedSlots = Record<string, NodeTemplateChild>;
export type NodeTemplateSlots = NodeTemplateChild[] | NodeTemplateNamedSlots;

export type NodeTemplate = [
    NodeTemplateTag,
    NodeTemplateValues?,
    NodeTemplateEvents?,
    NodeTemplateSlots?
];

export interface ComponentBase<A, E = never, S extends string = never> {
  ref?: string;
  name: string;
  collection: string;
  state?: Expression;
  render: (instance: ComponentInstance<A, E, S>) => NodeTemplate;
  created?: (instance: ComponentInstance<A, E, S>, e: Node) => void;
  updated?: (instance: ComponentInstance<A, E,S>, e: Node) => void;
  destroyed?: (instance: ComponentInstance<A, E, S>, e: Node) => void;
}

export type IfNever<T, Y, N> = [T] extends [never] ? Y : N;

export type Component<A = never, E = never, S extends string = never> = 
  ComponentBase<A, E, S> & 
  IfNever<A, {}, { attributes: { [V in keyof A]: ComponentValue<A, E, S, V> | Type } }> & 
  IfNever<E, {}, { events: { [K in keyof E]: Type } }> & 
  IfNever<S, {}, { slots: { [L in S]: ObjectType } }>
;


export const RootComponent: Component<any, any, any> =  {
    collection: 'expangine',
    name: 'root',
    attributes: {},
    events: {},
    slots: {},
    render: () => [':slot', {}, {}, []],
};

// example implementations

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

const google: any = null;

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
 * [':for', { :items: Expression, :item: string, :index: string, :key: Expression }, { },
 *  [...childTemplate]
 * ]
 * [':if, { :condition: Expression }, {}, {
 *  default: [...children]
 * }]
 * [':show, { :condition: Expression }, {}, 
 *  [...children]
 * ]
 * [':hide, { :condition: Expression }, {}, 
 *  [...children]
 * ]
 * [':slot, { :name: string }, {}, 
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
 * alert:
 * render() => ['div', { class:  }, {}, [
 *   [':slot', { ':name': 'cell', slotMessage: exprThatPopulatesValue }, {}, [
 *     ['path', ['get', 'this', 'message']]
 *   ]]
 * ]]
 * 
 * ['alert', { message: 'Hello' }, { eventName: exprForEvent }, {
 *   cell: ['path]
 * }]
 * 
 * 
 * ComponentType = object with attribute and local component state
 * 
 * 
 * Solve
 * - how will user-defined components trigger an event?
 * 
 */

export const DEFAULT_SLOT = 'default';
export const COMPILER_DEFAULT = '*';
export const COMPILER_DYNAMIC = ':dynamic';
export const COMPILER_COMPONENT = ':component';
export const DIRECTIVE_IF = ':if';
export const DIRECTIVE_SHOW = ':show';
export const DIRECTIVE_HIDE = ':hide';
export const DIRECTIVE_FOR = ':for';
export const DIRECTIVE_SLOT = ':slot';


export const components: Record<string, Component<any, any, any>> = {};

export interface NodeInstance 
{
    parent?: NodeInstance;
    children?: NodeInstance[];
    component: ComponentInstance<any, any, any>;
    element: Node;
    scope?: any;
}

export type NodeCompiler = (template: NodeTemplate, component: ComponentInstance<any, any, any>, parent?: NodeInstance, scope?: any) => NodeInstance;

export const compilers: Record<string, NodeCompiler> = {};

export function getCompiler(template: NodeTemplate): NodeCompiler 
{
    const [tag] = template;
    const key = isString(tag) 
        ? tag in compilers
            ? tag
            : COMPILER_DEFAULT
        : COMPILER_DYNAMIC;

    return compilers[key];
}

export function compile(template: NodeTemplate, component: ComponentInstance<any, any, any>, parent?: NodeInstance, scope?: any): NodeInstance
{
    return getCompiler(template)(template, component, parent, scope);
}

export function mount(page: any, template: NodeTemplate, replace: Node): ComponentInstance<any, any, any>
{
    const rootScope = objectToScope({ page, refs: {} });

    const instance = newComponentInstance(RootComponent, { default: template });
    const compiled = compile(template, instance, undefined, rootScope);

    replace.parentElement?.replaceChild(compiled.element, replace);

    instance.node = compiled;

    return instance;
}

export function isStyleElement(x: any): x is HTMLElement 
{
    return !!x && isObject(x.style);
}

export function getSlots(slots?: NodeTemplateSlots, name: string = DEFAULT_SLOT): NodeTemplateChild[]
{
    return !slots
        ? []
        : isArray(slots)
            ? slots
            : isObject(slots) && slots[name]
                ? [slots[name]]
                : [];
}

export function objectToScope(object: any)
{
    function scope() { /* not empty */ }
    return Object.assign(new (scope as any)(), object);
}

export function childScope(parent: any, object: any) 
{
    function child() { /* not empty */ }
    child.prototype = parent;
    return Object.assign(new (child as any)(), object);
}

export function isNamedSlots(value: any): value is NodeTemplateNamedSlots
{
    return typeof value === 'object' && !Array.isArray(value);
}

export function changeElement(instance: NodeInstance, element: Node)
{
    instance.element.parentElement?.replaceChild(element, instance.element);
    instance.element = element;
}




compilers[COMPILER_DYNAMIC] = (template, component, parent, scope) =>
{
    const [tag] = template;
    const instance: NodeInstance = { parent, component, element: document.createComment('dynamic') };

    component.watch(tag, (tagValue) =>
    {
        template[0] = tagValue;

        const dynamicInstance = compile(template, component, parent, scope);

        changeElement(instance, dynamicInstance.element);
    });

    return instance;
};

compilers[COMPILER_DEFAULT] = (template, component, parent, scope) => 
{
    const [tag, attrs, events, childSlots] = template;
    const element = document.createElement(tag as any) as HTMLElement;
    const instance: NodeInstance = { element, component, parent };

    if (isObject(attrs)) 
    {
        for (const attr in attrs) 
        {
            const attrValue = attrs[attr];

            if (isArray(attrValue)) 
            {
                component.watch(attrValue, (v) => 
                {
                    element.setAttribute(attr, v);
                });
            } 
            else 
            {
                element.setAttribute(attr, attrValue);
            }
        }
    }

    if (isObject(events)) 
    {
        for (const ev in events) 
        {
            const eventValue = events[ev];

            if (isFunction(eventValue)) 
            {
                element.addEventListener(ev, eventValue);
            } 
            else
            { 
                const listener = component.eval(eventValue);

                // todo: prevent, stop, capture, self, once
                element.addEventListener(ev, (nativeEvent) => 
                {
                    if (listener() === false) 
                    {
                        return false;
                    }
                });
            }
        }
    }

    const childs =  getSlots(childSlots);

    if (childs.length > 0) 
    {
        const children: NodeInstance[] = [];

        for (const childTemplate of childs) 
        {
            if (isString(childTemplate)) 
            {
                element.append(childTemplate);
            } 
            else if (childTemplate instanceof Expression)
            {
                const textNode = document.createTextNode('');

                component.watch(childTemplate, (text) =>
                {
                    textNode.textContent = text;
                });
            }
            else 
            {
                const childNode = compile(childTemplate, component, instance, scope);
    
                element.appendChild(childNode.element);
                children.push(childNode);
            }
        }

        instance.children = children;
    }

    return instance;
};

compilers[DIRECTIVE_IF] = (template, component, parent, scope) => 
{
    const [, attrs, , childSlots] = template;
    const placeholder = document.createComment('if');
    let element: Node = placeholder;
    const instance: NodeInstance = { parent, component, element };

    const childTemplate = getSlots(childSlots)[0];

    if (attrs && attrs.condition && childTemplate) 
    {    
        let visible: boolean = false;

        const check = () => 
        {
            const previous = instance.element;
            const desired = visible ? element : placeholder;

            if (previous !== desired) 
            {
                changeElement(instance, desired);
            }

            // disable/enable childNode based on visible
        };

        if (isString(childTemplate)) 
        {
            element = document.createTextNode(childTemplate);
        } 
        else if (childTemplate instanceof Expression)
        {
            const textNode = document.createTextNode('');

            component.watch(childTemplate, (text) =>
            {
                textNode.textContent = text;
            });
        }
        else 
        {
            const childNode = compile(childTemplate, component, instance, scope);
            element = childNode.element;
            instance.children = [childNode];
        }

        component.watch(attrs.condition, (newVisible) => 
        {
            visible = newVisible;
            check();
        });
    }

    return instance;
};

compilers[DIRECTIVE_SHOW] = compilers[DIRECTIVE_HIDE] = (template, component, parent, scope) => 
{
    const [tag, attrs, , childSlots] = template;
    const show = tag === DIRECTIVE_SHOW;
    const placeholder = document.createComment((tag as string).substring(1));
    let element: Node = placeholder;
    const instance: NodeInstance = { parent, component, element };
    
    const childTemplate = getSlots(childSlots)[0];
    
    if (attrs && attrs.condition && childTemplate) 
    {    
        let visible: boolean = false;
        
        const check = () => 
        {
            const isVisible = (visible === show);

            if (isString(childTemplate))
            {
                const previous = instance.element;
                const desired = isVisible ? element : placeholder;

                if (previous !== desired) 
                {
                    changeElement(instance, desired);
                }
            }
            else if (isStyleElement(instance.element))
            {
                instance.element.style.display = isVisible ? '' : 'none';
            }
        };

        if (isString(childTemplate)) 
        {
            element = document.createTextNode(childTemplate);

            check();
        } 
        else if (childTemplate instanceof Expression)
        {
            const textNode = document.createTextNode('');

            component.watch(childTemplate, (text) =>
            {
                textNode.textContent = text;
            });
        }
        else 
        {
            const childNode = compile(childTemplate, component, instance, scope);

            element = childNode.element;
            instance.children = [childNode];
        }

        component.watch(attrs.condition, (newVisible) => 
        {
            visible = !!newVisible;

            check();
        });
    }

    return instance;
};

compilers[COMPILER_COMPONENT] = (template, parentComponent, parent, scope) => 
{
    const [id, attrs, events, childSlots] = template;
    const componentBase = components[id as string];
    const component = newComponentInstance(componentBase, isNamedSlots(childSlots) ? childSlots : undefined, parentComponent);
    const rendered = componentBase.render(component);
    const localScope = childScope(parent, { this: component });
    const instance = compile(rendered, component, parent, localScope);

    if (scope && scope.refs && componentBase.ref)
    {
        scope.refs[componentBase.ref] = component;
    }

    component.node = instance;

    if (componentBase.attributes)
    {
        for (const attr in componentBase.attributes)
        {
            const attrValue = componentBase.attributes[attr];
            const attrObject = attrValue instanceof Type
                ? { type: attrValue }
                : attrValue;

            const attrInput = attrs && attr in attrs ? attrs[attr] : attrObject.default;

            if (isArray(attrInput))
            {
                let first = true;

                component.watch(attrInput, (v) =>
                {
                    component.set(attr, v);

                    if (instance.element)
                    {
                        if (first && attrObject.initial)
                        {
                            attrObject.initial(v, component, instance.element);
                        }
                        else if (!first && attrObject.changed)
                        {
                            attrObject.changed(v, component, instance.element);
                        }
                        if (attrObject.update)
                        {
                            attrObject.update(v, component, instance.element);
                        }
                        if (!first && componentBase.updated)
                        {
                            componentBase.updated(component, instance.element);
                        }
                    }
                    
                    first = false;
                });
            }
            else
            {
                component.set(attr, attrInput);
            }
        }
    }

    if (componentBase.state)
    {
        const localState = component.eval(componentBase.state)();

        if (isObject(localState)) 
        {
            for (const stateName in localState)
            {
                component.set(stateName, localState[stateName]);
            }
        }
    }

    if (isObject(events) && componentBase.events) 
    {
        for (const ev in events) 
        {
            if (!(ev in componentBase.events))
            {
                continue;
            }

            const eventValue = events[ev];

            if (isArray(eventValue)) 
            {
                const listener = component.eval(eventValue);

                component.on(ev, listener);
            }
        }
    }

    if (componentBase.created && instance.element) 
    {
        componentBase.created(component, instance.element);
    }
    
    return instance;
};

compilers[DIRECTIVE_SLOT] = (template, component, parent, scope) => 
{
    const [, attrs, , childSlots] = template;
    const element = document.createComment('slot');
    const instance: NodeInstance = { parent, component, element };

    if (attrs)
    {
        const slotName = attrs.name || DEFAULT_SLOT;
        const slotScope = attrs.scope || {};
        const slot = getSlots(component.slots, slotName)[0] || getSlots(childSlots, slotName)[0];
        
        if (slot) 
        {
            if (isString(slot)) 
            {
                instance.element = document.createTextNode(slot);
            }
            else if (slot instanceof Expression)
            {
                const textNode = document.createTextNode('');

                component.watch(slot, (text) =>
                {
                    textNode.textContent = text;
                });
            }
            else
            {
                const slotCompiled = compile(slot, component, instance, childScope(scope, slotScope));

                instance.element = slotCompiled.element;
            }
        }
    }

    return instance;
};

compilers[DIRECTIVE_FOR] = (template, component, parent, scope) => 
{
    const [, attrs, , childSlots] = template;
    const element = document.createComment('for');
    const instance: NodeInstance = { parent, component, element };
    const itemTemplate = getSlots(childSlots)[0];

    if (attrs && attrs.items && parent && isArray(itemTemplate))
    {
        const propItem = attrs.item || 'item';
        const propIndex = attrs.index || 'index';
        const key = component.eval(attrs.key);
        const map = new Map<any, NodeInstance>();

        component.watch(attrs.items, (items) =>
        {
            let current: Node | undefined | null = parent.element.firstChild;
            const keys = new Set();

            for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
            {
                const item = items[itemIndex];
                const itemScope = { [propItem]: item, [propIndex]: itemIndex };
                const itemKey = key(itemScope);
                let itemNode = map.get(itemKey);

                if (!itemNode)
                {
                    itemNode = compile(itemTemplate, component, instance, childScope(scope, itemScope));

                    map.set(itemKey, itemNode);
                }
                else
                {
                    Object.assign(itemNode.scope, itemScope); // do this in a way that triggers expressions to be updated
                }

                keys.add(itemKey);

                if (current !== itemNode.element)
                {
                    if (current)
                    {
                        parent.element.replaceChild(itemNode.element, current);
                        current = itemNode.element;
                    }
                    else
                    {
                        parent.element.appendChild(itemNode.element);
                    }
                }

                current = current?.nextSibling;
            }

            map.forEach((entryValue, entryKey) => 
            {
                if (!keys.has(entryKey)) 
                {
                    entryValue.element.parentElement?.removeChild(entryValue.element);

                    map.delete(entryKey);
                }
            });
        });
    }

    return instance;
};
