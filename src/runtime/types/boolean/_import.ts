import { Types } from 'expangine-runtime';
import { Registry } from '../../Registry';

import { BooleanVisuals, BooleanBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(BooleanVisuals)
    .addTypeBuilder(BooleanBuilder)
    .addDataImportType({
      text: 'Boolean',
      priority: 2,
      is: isBoolean,
      parse: toBoolean,
      allowsEmpty: true,
      typeOf: () => Types.bool(),
    })
  ;
}

function isBoolean(x: any): boolean
{
  return (x + '').toLowerCase() in dataImportBooleans;
}

function toBoolean(x: any): boolean
{
  return dataImportBooleans[(x + '').toLowerCase()];
}

export const dataImportBooleans: Record<string, boolean> = 
{
  '0': false, 
  '1': true,
  'y': true, 
  'yes': true, 
  'n': false, 
  'no': false, 
  '': false, 
  'x': true,
  'f': false,
  't': true,
  'false': false,
  'true': true,
  'on': true,
  'off': false,
};
