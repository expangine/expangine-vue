import { PropType } from 'vue';
import { isString } from 'expangine-runtime';

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
    ? 'text' | 'select' | 'color' | 'select'
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

export function friendlyList(things: string[]): string
{
  switch (things.length) {
    case 0:  return '';
    case 1:  return things[0];
    case 2:  return things[0] + ' and ' + things[1];
    default: return things.slice(0, things.length - 1).join(', ') + ', and ' + things[things.length - 1];
  }
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
