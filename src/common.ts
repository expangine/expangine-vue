import { PropType } from 'vue';
import { isString, isArray, isObject, Type, Traverser, GetExpression, SetExpression, UpdateExpression, ConstantExpression, Expression, TypeClass, ExpressionBuilder, TextOps, DateFormat, currentLocale, ComputedExpression } from 'expangine-runtime';
import { TypeSettings, TypeVisualInput, TypeUpdateEvent } from './runtime/types/TypeVisuals';
import { Registry } from './runtime/Registry';
import { Trie } from './app/Trie';
import { LiveRuntime } from 'expangine-runtime-live';


const ex = new ExpressionBuilder();


export const ComplexityColors = [
  '#C8E6C9',
  '#FFF9C4',
  '#FFE0B2',
  '#FFCDD2',
  '#D1C4E9',
  '#BDBDBD',
];

export type ListOptions<T = string> = Array<{ 
  text: string; 
  description?: string; 
  value: T;
}>;

export type ListOptionsPriority<T = string> = Array<{ 
  text: string; 
  description?: string; 
  value: T;
  priority: number;
}>;

export type ListOptionsTokenized<T = string> = Array<{ 
  text: string; 
  description?: string; 
  value: T;
  tokens: Trie<number>;
}>;

export const PropTypeAny: PropType<any> = [String, Number, Boolean, Array, Object, Date, Function, Symbol, Map];

export type SimpleTypes = 'text' | 'number' | 'boolean' | 'combo' | 'select' | 'date' | 'color' | 'object' | 'items';

export type SimpleTypeForType<V> =
  V extends string
    ? 'text' | 'select' | 'color' | 'select' | 'icon'
: V extends number
    ? 'number' | 'select'
: V extends boolean
    ? 'boolean'
: V extends Date
    ? 'date'
: V extends string[]
    ? 'combo'
: V extends ListOptions<any>
    ? 'items'
: V extends object
    ? 'object'
: SimpleTypes;

export interface SimpleFieldOption<N = string, T = SimpleTypes, V = any>
{
  type: T;
  name: N;
  label: string;
  required?: boolean;
  items?: V[] | ListOptions<V>;
  details?: string;
  fields?: SimpleFieldSettings<any>;
  defaultValue?: V;
  valueType?: 'text' | 'number';
}

export type SimpleFieldOptionForProperty<O, K extends keyof O> = SimpleFieldOption<K, SimpleTypeForType<O[K]>, O[K]>;

export type SimpleFieldSettings<O> = Array<SimpleFieldOptionForProperty<O, keyof O>>;

export function friendlyList(things: string[], last: string = ' and '): string
{
  switch (things.length) {
    case 0:  return '';
    case 1:  return things[0];
    case 2:  return things[0] + last + things[1];
    default: return things.slice(0, things.length - 1).join(', ') + ',' + last + things[things.length - 1];
  }
}

export function obj<K extends string>(values?: Record<K, any>): Record<K, any>
{
  const x = Object.create(null);

  if (values)
  {
    Object.assign(x, values);
  }

  return x;
}

export function formatDate<O = undefined>(
  date: Date | string | undefined, 
  otherwise: O, 
  withTime: boolean = false): string | O 
{
  if (isString(date))
  {
    if ((!withTime && date.length === 10) || (withTime && date.length === 16))
    {
      return date;
    }

    const time = Date.parse(date);

    date = isFinite(time) ? new Date(time) : undefined;
  }

  if (!(date instanceof Date)) 
  {
    return otherwise;
  }

  return withTime
    ? DateFormat.format('Y-MM-DD HH:mm', [date, currentLocale])
    : DateFormat.format('Y-MM-DD', [date, currentLocale]);
}

export function asArray<T>(value: T[] | T | null | undefined): T[]
{
  return isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];
}

export function initializeSubs(registry: Registry, value: TypeUpdateEvent): TypeUpdateEvent
{
  const { type, settings } = value;

  const visuals = registry.getTypeVisuals(type);
  const input = visuals.inputs[settings.input];

  if (isSubArray(settings))
  {
    const subs = settings.sub;
    const inputNumber = input as TypeVisualInput<any, any, number>;

    for (let i = 0; i < subs.length; i++)
    {
      inputNumber.onSubAdd(i, type, settings);
    }
  }
  else if (isSubObject(settings))
  {
    const subs = settings.sub;
    const inputString = input as TypeVisualInput<any, any, string>;

    for (const prop in subs)
    {
      inputString.onSubAdd(prop, type, settings);
    }
  }

  return value;
}

export function isSubArray(settings: any): settings is TypeSettings<any, number>
{
  return isArray(settings.sub);
}

export function isSubObject(settings: any): settings is TypeSettings<any, string>
{
  return isObject(settings.sub);
}

export function isExactType<T extends Type<O>, O = any>(x: Type, y: TypeClass<T, O>): x is T
{
  return x.constructor === y;
}

export function renameVariable(startingAt: Expression, from: string, to: string)
{
  startingAt.traverse(new Traverser((expr) =>  
  {
    if (isPathExpression(expr)) 
    {
      const first = expr.path[0];
      
      if (first instanceof ConstantExpression) 
      {
        if (first.value === from) 
        {
          first.value = to;
        }
      }
    }
  }));
}

export function isPathExpression(expr: Expression): expr is (GetExpression | SetExpression | UpdateExpression) 
{
  return expr instanceof GetExpression 
    || expr instanceof SetExpression 
    || expr instanceof UpdateExpression;
}

export function isInPathExpression(expr: Expression): boolean
{
  return expr.parent 
    && isPathExpression(expr.parent)
    && expr.parent.path.indexOf(expr) !== -1;
}

const phoneticDistance = LiveRuntime.getCommand(
  ex.op(TextOps.distance, {
    value: ex.op(TextOps.metaphone, { value: ex.get('a') }),
    test: ex.op(TextOps.metaphone, { value: ex.get('b') }),
  }),
);

export function findClosestPhonetic(haystack: string[], needle: string): string
{
  return haystack.reduce(
    (closest, field) => {
      const distance = phoneticDistance({ a: needle, b: field });
      if (closest.distance === -1 || distance < closest.distance) {
        closest.distance = distance;
        closest.text = field;
      }
      return closest;
    }, 
    { text: '', distance: -1 },
  ).text;
}

export function templateTokens(template: string): string[]
{
  return template.split(/[\{\}]/g);
}

export function templateReplace(template: string, values: (token: string) => string, labels: (label: string) => string = ((x) => x)): string
{
  return templateTokens(template)
    .map((segment, index) => index % 2 === 0
      ? labels(segment)
      : values(segment),
    )
    .join('')
  ;
}

export function castValue(value: any, valueType: Type, targetType: Type)
{
  const transform = castExpression(valueType, targetType, false);

  return transform ? LiveRuntime.run(transform, { value }) : undefined;
}

export function castExpression(valueType: Type, targetType: Type): Expression;
export function castExpression(valueType: Type, targetType: Type, createOnMissing: false): Expression | null;
export function castExpression(valueType: Type, targetType: Type, createOnMissing: boolean = true): Expression
{
  const opId = `${valueType.getId()}:~${targetType.getId()}`;
  const op = valueType.getOperations()[opId];

  return op
    ? ex.op(op, { value: ex.get('value') })
    : createOnMissing
      ? targetType.getCreateExpression(ex)
      : null as unknown as Expression;
}
