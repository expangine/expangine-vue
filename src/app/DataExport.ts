
import * as Papa from 'papaparse';
import { getInput } from './Input';
import { exportFile } from './FileExport';
import { isString, TextType, ObjectType, DateType } from 'expangine-runtime';
import { castValue, formatDate } from '@/common';
import { Registry } from '@/runtime/Registry';
import { isDate } from 'util';


export interface DataExportOptions
{
  namePrefix?: string;
  registry: Registry;
  data: any[];
  type?: ObjectType;
}

export type DataExportResult = true;

export async function getDataExport({ data, type, registry, namePrefix }: DataExportOptions): Promise<DataExportResult | string>
{
  const filename = await getInput({ 
    title: 'Export CSV',
    message: 'Enter a filename (without .csv extension)',
    value: (namePrefix || 'csv') + '-' +  Date.now(),
    label: 'Filename',
  });

  if (!filename) {
    return 'Export CSV canceled.';
  }

  const converted: any[] = [];

  data.forEach((row) => 
  {
    const convert: any = {};

    for (const prop in row) 
    {
      const value = row[prop];
      const propType = type 
        ? type.options.props[prop] || registry.defs.describe(value)
        : registry.defs.describe(value);

      if (value === null || value === undefined)
      {
        convert[prop] = '';
      }
      else if (isString(value))
      {
        convert[prop] = value;
      }
      else if (isDate(value))
      {
        const withTime = propType instanceof DateType
          ? propType.options.withTime
          : false;

        convert[prop] = formatDate(value, '', withTime);
      }
      else
      {
        convert[prop] = castValue(value, propType, TextType.baseType);
      }
    }

    converted.push(convert);
  });

  const name = filename + '.csv';
  const content = Papa.unparse(converted);

  exportFile({
    type: 'text/csv',
    name,
    content,
  });

  return true;
}
