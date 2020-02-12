import { Types, parse } from 'expangine-runtime';
import { Registry } from '../../Registry';

import { DateVisuals, DateBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(DateVisuals)
    .addTypeBuilder(DateBuilder)
    .addDataImportType({
      text: 'Date',
      priority: 5,
      is: isDate,
      parse: toDate,
      typeOf: () => Types.date(),
    })
  ;
}

function isDate(x: any): boolean
{
  return !isFinite(Number(x)) && isFinite(toDate(x).getTime());
}

function toDate(x: any): Date
{
  return parse(x) || new Date(Number.NaN);
}
