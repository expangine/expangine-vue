
import { Types, isWhole } from 'expangine-runtime';
import { Registry } from '../../Registry';

import { NumberVisuals, NumberBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(NumberVisuals)
    .addTypeBuilder(NumberBuilder)
    .addDataImportType({
      text: 'Percent',
      priority: 1,
      description: 'The value is divided by 100',
      is: isPercent,
      parse: toPercent,
      typeOf: () => Types.number(),
    })
    .addDataImportType({
      text: 'Number',
      priority: 3,
      is: isNumber,
      parse: toNumber,
      typeOf: () => Types.number(),
    })
    .addDataImportType({
      text: 'Whole Number',
      priority: 4,
      is: (x) => isNumber(x) && isWhole(toNumber(x)),
      parse: toNumber,
      typeOf: () => Types.number(undefined, undefined, true),
    })
  ;
}



const SEPARATOR_NUMBER = 1.5;
const SEPARATOR_OFFSET = 3;

function getDecimalSeparator() 
{
  return SEPARATOR_NUMBER.toLocaleString().substring(1, SEPARATOR_OFFSET - 1);
}

function getThousandSeparator() 
{
  return getDecimalSeparator() === '.' ? ',' : '.';
}

function isPercent(x: string): boolean
{
  return x.indexOf('%') === x.length - 1
    && isFinite(toPercent(x));
}

function toPercent(x: string): number
{
  return toNumber(x) / 100;
}

function isNumber(x: string): boolean
{
  return isFinite(toNumber(x));
}

function toNumber(x: string): number
{
  return Number(x
    .replace(getThousandSeparator(), '')
    .replace(/[\%\$\s]/g, ''),
  );
}
