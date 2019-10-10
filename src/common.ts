import { PropType } from 'vue';
import { isString, isArray, isObject, Type, Traverser, GetExpression, SetExpression, UpdateExpression, ConstantExpression, Expression } from 'expangine-runtime';
import { TypeAndSettings, TypeSettings, TypeVisualInput } from './runtime/types/TypeVisuals';
import { Registry } from './runtime/Registry';
import { TypeBuildResult } from './runtime/types/TypeBuilder';
import { TypeModifyResult } from './runtime/types/TypeModifier';


export type ListOptions<T = string> = Array<{ 
  text: string; 
  description?: string; 
  value: T 
}>;

export type ListOptionsPriority<T = string> = Array<{ 
  text: string; 
  description?: string; 
  value: T, 
  priority: number 
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

  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  
  let formatted = y + '-' + pad2(m) + '-' + pad2(d);

  if (withTime)
  { 
    const h = date.getHours();
    const i = date.getMinutes();

    formatted += ' ' + pad2(h) + ':' + pad2(i);
  }

  return formatted;
}

export function pad2(n: number)
{
  return n < 10 ? '0' + n : n;
}

export function asArray<T>(value: T[] | T | null | undefined): T[]
{
  return isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];
}

export function initializeSubs<
  T extends TypeAndSettings | TypeBuildResult | TypeModifyResult
>(registry: Registry, value: T): T
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

export function renameVariable(startingAt: Expression, from: string, to: string)
{
  startingAt.traverse(new Traverser((expr) =>  
  {
    if (expr instanceof GetExpression || expr instanceof SetExpression || expr instanceof UpdateExpression) 
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
