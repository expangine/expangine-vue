import { observe, unobserve, watch, Node as LinkedNode, Watcher } from 'scrute';
import { Type, Expression, Types, ObjectType, isArray, isObject, isFunction, isString, NoExpression } from 'expangine-runtime';
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
    changed?: (value: A[V], instance: ComponentInstance<A, E, S>, e: Node[]) => void;
    initial?: (value: A[V], instance: ComponentInstance<A, E, S>, e: Node[]) => void;
    update?: (value: A[V], instance: ComponentInstance<A, E, S>, e: Node[]) => void;
}

export class ComponentInstance<A, E, S extends string> {
    public component: Component<A, E, S>;
    public cache: Record<string, any>;
    public scope: Scope<A>;
    public node?: NodeInstance;
    public parent?: ComponentInstance<any, any, any>;
    public slots?: NodeTemplateNamedSlots;
    public listeners: Record<keyof E, Array<(payload: any) => any>>;

    public constructor(component: Component<A, E, S>, slots?: NodeTemplateNamedSlots, parent?: ComponentInstance<any, any, any>) {
        this.component = component;
        this.cache = Object.create(null);
        this.scope = new Scope(parent ? parent.scope : null);
        this.slots = slots;
        this.parent = parent;
        this.listeners = Object.create(null);
    }

    public trigger<K extends keyof E>(eventName: K, payload: E[K]): void {
        if (eventName in this.listeners) {
            this.listeners[eventName].forEach((l) => l(payload));
        }
    }

    public on<K extends keyof E>(eventName: K, listener: (payload: E[K]) => any): Off {
        if (!(eventName in this.listeners)){ 
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(listener);

        return () => {
            const i = this.listeners[eventName].indexOf(listener);
            if (i !== -1) {
                this.listeners[eventName].splice(i, 1);
            }
        };
    }

    public update(): void {
        if (this.component.updated && this.node) {
            this.component.updated(this, this.node.element);
        }
    }

    public render(): void {

    }

    public destroy(): void {
        this.scope.destroy();
        this.listeners = Object.create(null);
    }
}

export class Scope<A extends LiveContext = any> {
    
    public parent: Scope | null;
    public data: A;
    public observed: A;
    public link: LinkedNode<Scope<A>>;
    public children?: LinkedNode<Scope<A>>;
    public disables: number;
    public watchers: LinkedNode<Watcher>;
    
    public constructor(parent: Scope | null = null, data: any = {}) {
        this.parent = parent;
        this.data = parent ? createChildScope(parent.data, data) : createScope(data);
        this.observed = observe(this.data);
        this.disables = 0;
        this.link = new LinkedNode(this);
        this.watchers = LinkedNode.head();
    }

    public addToParent() {
        if (this.parent) {
            if (!this.parent.children) {
                this.parent.children = LinkedNode.head();
            }
            this.link.insertAfter(this.parent.children);
        }
    }

    public createChild(data: any = {}, addToParent: boolean = true): Scope {
        const child = new Scope(this, data);
        if (addToParent) {
            child.addToParent();
        }
        return child;
    }

    public get<V extends keyof A>(attr: V, defaultValue?: A[V]): A[V] {
        return attr in this.observed ? this.observed[attr] : defaultValue as A[V];
    }

    public set<V extends keyof A>(attr: V, value: A[V]): void {
        this.observed[attr] = value;
    }

    public setMany(values: Partial<A>) {
        copyProperties(this.observed, values);
    }

    public watch(expr: any, onValue: (value: any) => void): Off {
        const cmd = LiveRuntime.eval(expr);

        const watcher = watch(() => {
            onValue(cmd(this.observed));
        });

        const node = new LinkedNode(watcher);

        node.insertAfter(this.watchers);

        return () => {
            watcher.off();
            node.remove();
        };
    }

    public eval(expr: any): ((extra?: any) => any) {
        const cmd = LiveRuntime.eval(expr);

        return (extra) => cmd(extra ? { ...this.data, ...extra} : this.data);
    }

    public enable(): void {
        if (this.disables > 0) {
            this.disables--;
            if (this.disables === 0) {
                this.watchers.forEach((w) => w.resume());
            }
            if (this.children) {
                this.children.forEach((c) => c.enable());
            }
        }
    }

    public disable(): void {
        if (this.disables === 0) {
            this.watchers.forEach((w) => w.pause());
        }
        if (this.children) {
            this.children.forEach((c) => c.disable());
        }
        this.disables++;
    }

    public setEnabled(enabled: boolean) {
        enabled ? this.enable() : this.disable();
    }

    public destroy(): void {
        this.link.remove();
        this.disables = Number.MAX_SAFE_INTEGER;
        this.watchers.forEach((w) => w.off());
        if (this.children) {
            this.children.forEach((c) => c.destroy());
        }
        unobserve(this.observed);
    }
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
  created?: (instance: ComponentInstance<A, E, S>, e: Node[]) => void;
  updated?: (instance: ComponentInstance<A, E, S>, e: Node[]) => void;
  destroyed?: (instance: ComponentInstance<A, E, S>, e: Node[]) => void;
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
        type: i.scope.get('type'),
        value: i.scope.get('value'),
    }],
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
 * - modifications to elements/nodes should be queued
 * - nodes can have multiple elements (for, default scope not restricted to first)
 * - triggering custom component events should be queued (created, updated, initial, changed, update)
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
    element: Node[];
    scope: Scope;
}

export type NodeCompiler = (template: NodeTemplate, component: ComponentInstance<any, any, any>, scope: Scope, parent?: NodeInstance) => NodeInstance;

export const compilers: Record<string, NodeCompiler> = {};

export function getCompiler(template: NodeTemplate): NodeCompiler 
{
    const [tag] = template;
    const key = isString(tag) 
        ? tag in compilers
            ? tag
            : tag in components
                ? COMPILER_COMPONENT
                : COMPILER_DEFAULT
        : COMPILER_DYNAMIC;

    return compilers[key];
}

export function compile(template: NodeTemplate, component: ComponentInstance<any, any, any>, scope: Scope, parent?: NodeInstance): NodeInstance
{
    return getCompiler(template)(template, component, scope, parent);
}

export function mount(page: any, template: NodeTemplate, replace: Node): ComponentInstance<any, any, any>
{
    const rootScope = new Scope(null, { page, refs: {} });

    const instance = new ComponentInstance(RootComponent, { default: template });
    const compiled = compile(template, instance, rootScope);

    if (replace.parentElement) {
        for (const e of compiled.element) {
            replace.parentElement.insertBefore(e, replace);
        }
        replace.parentElement.removeChild(replace);
    }

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

export function copyProperties(target: any, source: any)
{
    for (const prop in source)
    {
        target[prop] = source[prop];
    }

    return target;
}

export function createScope(object: any)
{
    function scope() { /* not empty */ }
    return copyProperties(new (scope as any)(), object);
}

export function createChildScope(parent: any, object: any) 
{
    function child() { /* not empty */ }
    child.prototype = parent;
    return copyProperties(new (child as any)(), object);
}

export function isNamedSlots(value: any): value is NodeTemplateNamedSlots
{
    return typeof value === 'object' && !Array.isArray(value);
}

export function changeElement(instance: NodeInstance, element: Node[])
{
    for (let i = 0; i < element.length; i++) {
        const n = element[i];
        const o = instance.element[i];

        if (o === n) {
            continue;
        }

        if (o && o.parentElement) {
            o.parentElement.replaceChild(n, o);
            instance.element[i] = n;
        } else if (!o && i > 0) {
            const prev = instance.element[i - 1];
            const next = prev.nextSibling;
            if (next && next.parentElement) {
                next.parentElement.insertBefore(n, next);
            } else if (!next && prev && prev.parentElement) {
                prev.parentElement.appendChild(n);
            }
            instance.element[i] = n;
        }
    }

    for (let i = instance.element.length - 1; i >= element.length; i--) {
        const o = instance.element[i];
        if (o.parentElement) {
            o.parentElement.removeChild(o);
        }
        instance.element.splice(i, 1);
    }
}

export interface NodeChildrenController
{
    element: Node[];
    updateScopes( values: any ): void;
    destroyScopes(): void;
}

export function createChildNodes(children: NodeTemplateChild[], scope: Scope, component: ComponentInstance<any, any, any>, childScope: Scope, instance: NodeInstance): NodeChildrenController
{
    let element: Node[] = [];
    let scopes: Scope[] = [];

    for (const child of children)
    {
        if (isString(child)) 
        {
            element.push(document.createTextNode(child));
        } 
        else if (child instanceof Expression)
        {
            const textNode = document.createTextNode('');

            scope.watch(child, (text) =>
            {
                textNode.textContent = text;
            });

            element.push(textNode);
        }
        else 
        {
            const childNode = compile(child, component, childScope, instance);

            for (let i = 0; i < childNode.element.length; i++)
            {
                element.push(childNode.element[i]);
            }

            scopes.push(childNode.scope);

            if (!instance.children)
            {
                instance.children = [childNode];
            }
            else
            {
                instance.children.push(childNode);
            }
        }
    }

    return {
        element,
        updateScopes(values: any) {
            for (const scope of scopes) {
                scope.setMany(values);
            }
        },
        destroyScopes() {
            for (const scope of scopes) {
                scope.destroy();
            }
        },
    };
}

export function createChildElement(child: NodeTemplateChild, scope: Scope, component: ComponentInstance<any, any, any>, childScope: Scope, instance: NodeInstance): Node[]
{
    let element: Node[];

    if (isString(child)) 
    {
        element = [document.createTextNode(child)];
    } 
    else if (child instanceof Expression)
    {
        const textNode = document.createTextNode('');

        scope.watch(child, (text) =>
        {
            textNode.textContent = text;
        });

        element = [textNode];
    }
    else 
    {
        const childNode = compile(child, component, childScope, instance);

        element = childNode.element;

        if (!instance.children)
        {
            instance.children = [childNode];
        }
        else
        {
            instance.children.push(childNode);
        }
    }

    return element;
}

export function isWatchable(x: any): x is (Expression | any[])
{
    return isArray(x) || x instanceof Expression;
}


compilers[COMPILER_DYNAMIC] = (template, component, scope, parent) =>
{
    const [tag] = template;
    const instance: NodeInstance = { parent, component, scope, element: [document.createComment('dynamic')] };
    let lastInstance: NodeInstance;

    component.scope.watch(tag, (tagValue) =>
    {
        template[0] = tagValue;

        if (lastInstance)
        {
            lastInstance.scope.destroy();
        }

        const dynamicInstance = compile(template, component, scope, parent);

        changeElement(instance, dynamicInstance.element);

        lastInstance = dynamicInstance;
    });

    return instance;
};

compilers[COMPILER_DEFAULT] = (template, component, scope, parent) => 
{
    const [tag, attrs, events, childSlots] = template;
    const element = document.createElement(tag as any) as HTMLElement;
    const instance: NodeInstance = { element: [element], component, scope, parent };

    if (isObject(attrs)) 
    {
        for (const attr in attrs) 
        {
            const attrValue = attrs[attr];

            if (isWatchable(attrValue)) 
            {
                component.scope.watch(attrValue, (v) => 
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
                const listener = scope.eval(eventValue);

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
        for (const childTemplate of childs) 
        {
            const childElement = createChildElement(childTemplate, scope, component, scope, instance);

            for (const child of childElement)
            {
                element.appendChild(child);
            }
        }
    }

    return instance;
};

compilers[DIRECTIVE_IF] = (template, component, scope, parent) => 
{
    const [, attrs, , childSlots] = template;
    const placeholder = [document.createComment('if')];
    let element: Node[] = placeholder.slice();
    const instance: NodeInstance = { parent, component, scope, element };
    const childScope = scope.createChild();
    const childTemplate = getSlots(childSlots)[0];

    if (attrs && attrs.condition && childTemplate) 
    {
        element = createChildElement(childTemplate, scope, component, childScope, instance);

        let visible = false;

        scope.watch(attrs.condition, (newVisible) => 
        {
            const visibleBoolean = !!newVisible;

            if (visible !== visibleBoolean)
            {
                visible = visibleBoolean;
                
                const previous = instance.element;
                const desired = visible ? element : placeholder;

                if (previous !== desired) 
                {
                    changeElement(instance, desired);
                }

                childScope.setEnabled(visible);
            }
        });
    }
    else
    {
        throw new Error(`The :if directive requires a condition attribute and a single child.`);
    }

    return instance;
};

compilers[DIRECTIVE_SHOW] = compilers[DIRECTIVE_HIDE] = (template, component, scope, parent) => 
{
    const [tag, attrs, , childSlots] = template;
    const show = tag === DIRECTIVE_SHOW;
    const placeholder = [document.createComment((tag as string).substring(1))];
    let element: Node[] = placeholder.slice();
    const instance: NodeInstance = { parent, component, scope, element };
    const childScope = scope.createChild();
    const childTemplate = getSlots(childSlots)[0];
    
    if (attrs && attrs.condition && childTemplate) 
    {    
        let visible: boolean | undefined;
        
        element = createChildElement(childTemplate, scope, component, childScope, instance);

        scope.watch(attrs.condition, (newVisible) => 
        {
            const visibleBoolean = !!newVisible;

            if (visible !== visibleBoolean)
            {
                visible = visibleBoolean;

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

                childScope.setEnabled(isVisible);
            }           
        });
    }
    else
    {
        throw new Error(`The ${tag} directive requires a condition attribute and a singule child.`);
    }

    return instance;
};

compilers[COMPILER_COMPONENT] = (template, parentComponent, scope, parent) => 
{
    const [id, attrs, events, childSlots] = template;
    const componentBase = components[id as string];
    const component = new ComponentInstance(componentBase, isNamedSlots(childSlots) ? childSlots : undefined, parentComponent);
    const rendered = componentBase.render(component);
    const localScope = scope.createChild({ this: component, refs: {} });
    const instance = compile(rendered, component, localScope, parent);

    if (scope && scope.data.refs && componentBase.ref)
    {
        scope.data.refs[componentBase.ref] = component;
    }

    component.node = instance;
    component.scope = localScope;

    if (componentBase.attributes)
    {
        for (const attr in componentBase.attributes)
        {
            const attrValue = componentBase.attributes[attr];
            const attrObject = attrValue instanceof Type
                ? { type: attrValue }
                : attrValue;

            const attrInput = attrs && attr in attrs ? attrs[attr] : attrObject.default;

            if (isWatchable(attrInput))
            {
                let first = true;

                scope.watch(attrInput, (v) =>
                {
                    localScope.set(attr, v);

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
                localScope.set(attr, attrInput);
            }
        }
    }

    if (componentBase.state)
    {
        const localState = scope.eval(componentBase.state)();

        if (isObject(localState)) 
        {
            for (const stateName in localState)
            {
                localScope.set(stateName, localState[stateName]);
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

            if (isWatchable(eventValue)) 
            {
                const listener = localScope.eval(eventValue);

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

// TODO think about scope
compilers[DIRECTIVE_SLOT] = (template, component, scope, parent) => 
{
    const [, attrs, , childSlots] = template;
    const element = [document.createComment('slot')];
    const instance: NodeInstance = { parent, component, scope, element };

    if (attrs)
    {
        const slotName = attrs.name || DEFAULT_SLOT;
        const slotScope = attrs.scope || {};
        const slot = getSlots(component.slots, slotName)[0] || getSlots(childSlots, slotName)[0];
        
        if (slot) 
        {
            instance.element = createChildElement(slot, component.scope, component, scope, instance);
        }
    }

    return instance;
};

compilers[DIRECTIVE_FOR] = (template, component, scope, parent) => 
{
    const [, attrs, , childSlots] = template;
    const placeholder = document.createComment('for');
    const element = [placeholder];
    const instance: NodeInstance = { parent, component, scope, element };
    const itemTemplate = getSlots(childSlots);

    if (attrs && attrs.items && parent)
    {
        const propItem = attrs.item || 'item';
        const propIndex = attrs.index || 'index';
        const key = scope.eval(attrs.key);
        const map = new Map<any, NodeChildrenController>();

        scope.watch(attrs.items, (items) =>
        {
            const newChildren: Node[] = [placeholder];
            const keys = new Set();

            for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
            {
                const item = items[itemIndex];
                const itemScopeData = { [propItem]: item, [propIndex]: itemIndex };
                const itemKey = key(itemScopeData);
                let itemController = map.get(itemKey);

                if (!itemController)
                {
                    const itemScope = scope.createChild(itemScopeData);

                    itemController = createChildNodes(itemTemplate, itemScope, component, itemScope, instance);

                    map.set(itemKey, itemController);
                }
                else
                {
                    itemController.updateScopes(itemScopeData);
                }

                keys.add(itemKey);
                newChildren.push(...itemController.element);
            }

            changeElement(instance, newChildren);

            map.forEach((entryValue, entryKey) => 
            {
                if (!keys.has(entryKey)) 
                {
                    entryValue.destroyScopes();

                    map.delete(entryKey);
                }
            });
        });
    }

    return instance;
};


// EXAMPLES



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
        const google = (window as any).google;

        google.charts.setOnLoadCallback(() => {
            const chart = i.cache.chart || new google.visualization.PieChart(e[0]);
            const [data, label, value, title] = [
                i.scope.get('data'), 
                i.scope.get('label'), 
                i.scope.get('value'), 
                i.scope.get('title'),
            ];
            
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

            const chartTable = google.visualization.arrayToDataTable(chartData);

            chart.draw(chartTable, options);

            i.cache.chart = chart;
            i.cache.options = options;

            i.trigger('updated', null);
        });
    },
};

components['googlecharts/pie'] = PieChart as any;