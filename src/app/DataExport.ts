
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

  const columnMap: any = {};

  data.forEach((row) =>
  {
    for (const prop in row)
    {
      columnMap[prop] = true;
    }
  });

  const columns: string[] = Object.keys(columnMap);
  const converted: any[] = [];

  data.forEach((row) => 
  {
    const convert: any = {};

    for (const prop of columns)
    {
      const value = row[prop];
      const propType = type 
        ? type.options.props[prop] || registry.defs.describe(value)
        : registry.defs.describe(value);
      const valueType = propType.getExactType(value);

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
        const withTime = valueType instanceof DateType && valueType.options.withTime;

        convert[prop] = formatDate(value, '', withTime);
      }
      else
      {
        convert[prop] = castValue(value, valueType, TextType.baseType);
      }
    }

    converted.push(convert);
  });

  const name = filename + '.csv';
  const content = Papa.unparse(converted, { columns });

  exportFile({
    type: 'text/csv',
    name,
    content,
  });

  return true;
}
