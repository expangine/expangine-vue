
import Vue from 'vue';
import * as Papa from 'papaparse';
import { objectEach, TextType, ListType, Types, TypeMap, OptionalType, toMap, objectToArray, parse, isWhole } from 'expangine-runtime';
import { getFile } from './FileImport';
import { getPromiser } from './Promiser';
import { getSimpleInput } from './SimpleInput';
import { Registry } from '@/runtime/Registry';
import { SimpleFieldOption, findClosestPhonetic, castValue, friendlyList } from '@/common';
import { Project } from './Project';
import { Type, ObjectType, objectValues, objectMap } from 'expangine-runtime';
import { TypeSettingsRecord } from '@/runtime/types/TypeVisuals';
import { getConfirmation } from './Confirm';



export interface DataImportOptions
{
  registry: Registry;
  type: Type;
  worker?: boolean;
}

export type DataImportProject = Pick<Project, 'data' | 'type' | 'settings'>;

export interface DataImportResult
{
  transform: (project: DataImportProject) => DataImportProject;
}

export async function getDataImport({ registry, type, worker }: DataImportOptions): Promise<DataImportResult | string>
{
  const importResult = await getFile({ accept: '.csv' });

  if (!importResult.file)
  {
    return 'No file selected.';
  }

  const { promise, resolve } = getPromiser<DataImportResult | string>();

  Papa.parse(importResult.file, 
  {
    worker,
    
    header: true,

    skipEmptyLines: true,

    error: async (error) =>
    {
      resolve(error.message);
    },

    complete: async ({ data, meta }: { data: any[], meta: { fields: string[], aborted: boolean }}) => 
    {
      if (meta.aborted)
      {
        return resolve('There was a problem parsing the CSV.');
      }

      data = data.filter((row: any) => 
      {
        let hasValue = false;

        for (const prop in row) 
        {
          if (row[prop]) 
          {
            hasValue = true;
            break;
          }
        }

        return hasValue;
      });

      const fields: SimpleFieldOption[] = [
        { name: 'property', type: 'text', label: 'Property', details: 'The property to store the CSV data in.' },
        { name: 'configure', type: 'boolean', label: 'Choose Column Types', details: 'After selecting the columns to import, choose their type.' },
        { name: 'all', type: 'boolean', label: 'All Columns', details: 'Import all columns below' },
        { name: 'columns', type: 'object', label: 'Columns', 
          fields: meta.fields.map((column) => ({
            name: column,
            type: 'boolean',
            label: column,
          })),
        },
      ];

      if (type instanceof ObjectType) 
      {
        fields.push({
          name: 'action',
          type: 'select',
          label: 'Action',
          items: [
            { text: 'Replace data & type', value: 'replace' },
            { text: 'Add as property of current data & type', value: 'merge' },
          ],
        });
      }

      const settings = await getSimpleInput<any>({
        value: {
          columns: {}, 
          action: 'replace' as 'replace' | 'merge', 
          property: 'data',
          all: false,
          configure: false,
        },
        fields,
      });

      if (!settings) 
      {
        return resolve('CSV Import canceled.');
      }

      if (!settings.all)
      {
        data.forEach((row: any) => {
          for (const prop in row) {
            if (!settings.columns[prop]) {
              delete row[prop];
            }
          }
        });
      }

      const dataType = registry.defs.describe(data);

      if (!settings.configure)
      {
        return resolve('CSV Import canceled.');
      }

      const itemType = (dataType as ListType).options.item as ObjectType;
      const options: SimpleFieldOption[] = [];
      const answers: Record<string, DataImportSuggestedType | null | boolean> = {};
      const props: TypeMap = itemType.options.props;

      for (const prop in props)
      {
        const suggested = getDataImportSuggestedType(data, prop);

        options.push({
          name: prop,
          type: 'select',
          label: prop,
          required: true,
          items: suggested.map((suggestion) => ({
            text: suggestion.type.text,
            hint: suggestion.type.description,
            value: suggestion,
          })),
        });

        const first = suggested[0];

        answers[prop] = first;

        if (first.duplicates) 
        {
          const propEnum = `${prop}_enum`;

          options.push({
            name: propEnum,
            type: 'boolean',
            label: prop + ' as Enum',
            details: first.unique.length < 10
              ? friendlyList(first.unique)
              : `${first.unique.length} unique values`,
          });

          answers[propEnum] = false;
        }
      }
      
      const configure = await getSimpleInput({
        value: answers,
        fields: options,
      });

      if (configure)
      {
        for (const prop in props)
        {
          const chosen = configure[prop];
          
          if (chosen && chosen !== true && chosen.type)
          {
            chosen.unique.sort();
            
            props[prop] = chosen.type.typeOf(chosen.unique);

            const asEnum = configure[`${prop}_enum`];
            const valueToParsed: Record<string, any> = {};

            for (const value of chosen.unique)
            {
              valueToParsed[value] = chosen.type.parse(value);
            }

            if (asEnum)
            {
              const enumPairs = objectToArray(valueToParsed, (c) => [c, c]);
              
              props[prop] = Types.enum(props[prop], props[prop].clone(), toMap(enumPairs));
            }

            if (chosen.optional)
            {
              props[prop] = OptionalType.for(props[prop]);
              valueToParsed[''] = null;
            }

            for (const row of data)
            {
              row[prop] = valueToParsed[row[prop]];
            }
          }
        }
      }
      else
      {
        dataType.removeDescribedRestrictions();
      }
      

      if (settings.action === 'replace') 
      {
        const replaceType = ObjectType.from({ [settings.property]: dataType });
        const replaceSettings = registry.getTypeSettings(replaceType);

        resolve({
          transform: (project) => ({
            data: { [settings.property]: data },
            type: replaceType,
            settings: replaceSettings,
          }),
        });
      } 
      else 
      {
        const dataSettings = registry.getTypeSettings(dataType);

        resolve({
          transform: (project) => {
            if (project.type instanceof ObjectType) {
              Vue.set(project.type.options.props, settings.property, dataType);
              Vue.set((project.settings as TypeSettingsRecord<any, any>).sub, settings.property, dataSettings);
              Vue.set(project.data, settings.property, data);
            }

            return {
              data: project.data,
              type: project.type,
              settings: project.settings,
            };
          },
        });
      }
    },
  });

  return promise;
}

export interface DataImportMappingOptions
{
  registry: Registry;
  type: ObjectType;
  typeSettings: TypeSettingsRecord<any, any>;
  worker?: boolean;
}

export interface DataImportMappingResult 
{ 
  action: 'append' | 'replace';
  data: object[];
}

export async function getDataImportMapping({ registry, type, typeSettings, worker }: DataImportMappingOptions): Promise<DataImportMappingResult | string>
{
  const importResult = await getFile({ accept: '.csv' });

  if (!importResult.file)
  {
    return 'No file selected.';
  }

  const { promise, resolve } = getPromiser<DataImportMappingResult | string>();

  Papa.parse(importResult.file, 
  {
    worker,
    
    header: true,

    error: async (error) =>
    {
      resolve(error.message);
    },

    complete: async ({ data, meta }: { data: any[], meta: { fields: string[], aborted: boolean }}) => 
    {
      if (meta.aborted)
      {
        return resolve('There was a problem parsing the CSV.');
      }

      const VALUE_NONE = '';
      const VALUE_DEFAULT = '$$default$$';

      const props = type.options.props;
      const settings = await getSimpleInput({
        value: {
          action: 'append' as 'append' | 'replace',
          mappings: objectMap(props, (propType, prop) => findClosestPhonetic(meta.fields, prop)),
        },
        fields: [
          { name: 'action', type: 'select', label: 'Action', required: true, items: [
            { text: 'Append', value: 'append' },
            { text: 'Replace', value: 'replace' },
          ]},
          { name: 'mappings', type: 'object', label: 'Mappings', 
            fields: objectValues(props, (propType, prop) => ({
              name: prop,
              type: 'select',
              label: prop,
              required: true,
              items: ([] as Array<{ text: string, value: string }>).concat(
                (propType.isOptional() 
                  ? [{ text: 'No Value', value: VALUE_NONE }] 
                  : []
                ),
                [{ text: 'Default Value', value: VALUE_DEFAULT }],
                meta.fields.map((column) => ({
                  text: `Column "${column}"`,
                  value: column,
                })),
              ),
            })),
          },
        ],
      });

      if (!settings) 
      {
        return resolve('CSV Import canceled.');
      }

      const errors: string[] = [];
      const warnings: string[] = [];
      const converted: any[] = [];

      const isEmpty = (value: any, expectedType: Type) => {
        return value === null || value === undefined || (value === '' && !expectedType.acceptsType(TextType.baseType));
      };
      
      data.forEach((row, rowIndex) => 
      {
        const convert: any = {};

        objectEach(type.options.props, (propType, prop) => 
        {
          const mapping = settings.mappings[prop];

          switch (mapping) 
          {
            case VALUE_NONE:
              convert[prop] = null;
              break;

            case VALUE_DEFAULT:
              convert[prop] = propType.fromJson(typeSettings.sub[prop].defaultValue);
              break;

            default:
              const value = propType.normalize(row[mapping]);

              if (isEmpty(value, propType)) 
              {
                if (propType.isOptional()) 
                {
                  convert[prop] = null;
                } 
                else 
                {
                  errors.push(`[${rowIndex}] Missing required value in "${mapping}".`);
                }
              } 
              else if (propType.isValid(value)) 
              {
                convert[prop] = value;
              } 
              else 
              {
                const valueType = registry.defs.describe(value);
                const cast = castValue(value, valueType, propType);
                
                if (propType.isValid(cast)) 
                {
                  const castString = registry.getTypeToString(cast, propType, '', ' ', '');

                  convert[prop] = cast;
                  warnings.push(`[${rowIndex}] "${row[mapping]}" in "${mapping}" was converted to ${castString}`);
                } 
                else 
                {
                  const propDescribe = registry.getTypeDescribe(propType);

                  errors.push(`[${rowIndex}] "${row[mapping]}" could not be converted to ${propDescribe}`);
                }
              }
              break;
          }
        });

        converted.push(convert);
      });

      if (errors.length > 0) 
      {
        await getConfirmation({
          title: 'Invalid values were found',
          message: 
            'The file contained invalid values that could not be converted to the expected data types.' + 
            '<br><br><strong>Errors:</strong><br>' +
            '<ul><li>' + errors.join('</li><li>') + '</li></ul>' + 
            (warnings.length === 0 
              ? '' 
              : '<br><strong>Warnings:</strong><br>' + 
                '<ul><li>' + warnings.join('</li><li>') + '</li></ul>'
            )
          ,
          confirm: '',
          unconfirm: 'OK',
        });

        return resolve('Importing canceled due to invalid values.');
      } 
      else if (warnings.length > 0) 
      {
        const proceed = await getConfirmation({
          title: 'Just to let you know...',
          message: 
            'The file contained values that had to be converted. Proceed?' + 
            '<br><br><strong>Warnings:</strong><br>' +
            '<ul><li>' + warnings.join('</li><li>') + '</li></ul>'
          ,
          confirm: 'Import',
          unconfirm: 'Cancel Import',
        });

        if (!proceed) 
        {
          return resolve('Importing canceled due to invalid values.');
        }

        return resolve({
          action: settings.action,
          data: converted,
        });
      } 
      else 
      {
        return resolve({
          action: settings.action,
          data: converted,
        });
      }
    },
  });

  return promise;
}

export interface DataImportType
{
  text: string;
  description?: string;
  allowsEmpty?: boolean;
  is(x: string): boolean;
  parse(x: string): any;
  typeOf(unique: string[]): Type;
}

export interface DataImportSuggestedType
{
  type: DataImportType;
  optional: boolean;
  duplicates: boolean;
  unique: string[];
}

export const dataImportTypes: DataImportType[] = 
[
  {
    text: 'Percent',
    description: 'The value is divided by 100',
    is: isPercent,
    parse: toPercent,
    typeOf: () => Types.number(),
  },
  {
    text: 'Boolean',
    is: isBoolean,
    parse: toBoolean,
    allowsEmpty: true,
    typeOf: () => Types.bool(),
  },
  {
    text: 'Number',
    is: isNumber,
    parse: toNumber,
    typeOf: () => Types.number(),
  },
  {
    text: 'Whole Number',
    is: (x) => isNumber(x) && isWhole(toNumber(x)),
    parse: toNumber,
    typeOf: () => Types.number(undefined, undefined, true),
  },
  { 
    text: 'Date',
    is: isDate,
    parse: toDate,
    typeOf: () => Types.date(),
  },
  {
    text: 'Text',
    is: () => true,
    parse: (x) => x,
    allowsEmpty: true,
    typeOf: () => Types.text(),
  },
];

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

export function getDataImportSuggestedType(data: any[], column: string): DataImportSuggestedType[]
{
  const values = getColumnValues(data, column);

  const counts: Record<string, number> = {};
  const map: Record<string, boolean> = {};
  let empty = 0;
  let duplicates = 0;

  for (const dataType of dataImportTypes)
  {
    counts[dataType.text] = 0;
  }

  for (const value of values)
  {
    if (value === '')
    {
      empty++;
    }
    else 
    {
      if (map[value])
      {
        duplicates++;
      }

      map[value] = true;

      for (const dataType of dataImportTypes)
      {
        if (dataType.is(value))
        {
          counts[dataType.text]++;
        }
      }
    }
  }
  
  const nonEmpty = data.length - empty;
  const matches: DataImportSuggestedType[] = [];
  const unique: string[] = Object.keys(map);

  for (const dataType of dataImportTypes)
  {
    if (counts[dataType.text] === nonEmpty)
    {
      matches.push({
        type: dataType,
        optional: dataType.allowsEmpty ? false : empty > 0,
        duplicates: duplicates > 0,
        unique,
      });
    }
  }

  return matches;
}

export function getColumnValues(data: any[], column: string)
{
  return data.map((row) => row[column] || '');
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

function isBoolean(x: string): boolean
{
  return x.toLowerCase() in dataImportBooleans;
}

function toBoolean(x: string): boolean
{
  return dataImportBooleans[x.toLowerCase()];
}

function isDate(x: string): boolean
{
  return !isFinite(Number(x)) && isFinite(toDate(x).getTime());
}

function toDate(x: string): Date
{
  return parse(x) || new Date(Number.NaN);
}
