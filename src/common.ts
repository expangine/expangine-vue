import { isString } from 'expangine-runtime';

export type ListOptions<T = string> = Array<{ text: string; value: T }>;


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
