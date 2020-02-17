
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
import { TypeSettingsRecord, TypeDataImportMatch } from '@/runtime/types/TypeVisuals';
import { getConfirmation } from './Confirm';
import { getProgram } from './GetProgram';
import { sendNotification } from './Notify';
import { LiveRuntime } from 'expangine-runtime-live';
import { Preferences } from './Preference';


const PREF_CATEGORY = 'Data Import';
const PREF_CATEGORY_CONFIRM = 'Confirmation';


const PREF_DATA_IMPORT_CONVERT = Preferences.define({
  key: 'data_import_convert',
  label: 'Convert data values to correct type on import without confirmation',
  category: [PREF_CATEGORY, PREF_CATEGORY_CONFIRM],
  defaultValue: false,
});

const PREF_DATA_IMPORT_PROPERTY = Preferences.define({
  key: 'data_import_property',
  label: 'CSV Import default property',
  category: [PREF_CATEGORY],
  defaultValue: 'data',
});

const PREF_DATA_IMPORT_CHOOSE = Preferences.define({
  key: 'data_import_choose',
  label: 'CSV Import choose column types',
  category: [PREF_CATEGORY],
  defaultValue: false,
});

const PREF_DATA_IMPORT_ALL = Preferences.define({
  key: 'data_import_all',
  label: 'CSV Import all columns',
  category: [PREF_CATEGORY],
  defaultValue: false,
});

const PREF_DATA_IMPORT_ACTION = Preferences.define({
  key: 'data_import_all',
  label: 'CSV Import default action',
  category: [PREF_CATEGORY],
  defaultValue: 'replace',
  type: Types.enum(
    Types.text(),
    Types.text(),
    [
      ['Merge', 'merge'],
      ['Replace', 'replace'],
    ],
  ),
});


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
          action: Preferences.get(PREF_DATA_IMPORT_ACTION) as 'replace' | 'merge', 
          property: Preferences.get(PREF_DATA_IMPORT_PROPERTY),
          all: Preferences.get(PREF_DATA_IMPORT_ALL),
          configure: Preferences.get(PREF_DATA_IMPORT_CHOOSE),
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
      const answers: Record<string, TypeDataImportMatch | null | boolean> = {};
      const props: TypeMap = itemType.options.props;

      for (const prop in props)
      {
        const values = getColumnValues(data, prop);
        const suggested = registry.getDataImportMatches(values);
        
        options.push({
          name: prop,
          type: 'select',
          label: prop,
          required: true,
          items: suggested.map((suggestion) => ({
            text: suggestion.optional
              ? `${suggestion.type.text} (optional)`
              : suggestion.type.text,
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

      const VALUE_NONE = '';
      const VALUE_DEFAULT = '$$default$$';
      const VALUE_DYNAMIC = '$$dynamic$$';

      const props = type.options.props;
      const settings = await getSimpleInput({
        message: 'Each property in the object has a dropdown. Select which column from the imported data will be placed in each property.',
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
              getError(value, values) {
                if (meta.fields.indexOf(value) === -1) {
                  return '';
                }
                for (const valueProp in props) {
                  if (valueProp === prop) {
                    break;
                  }
                  if (values[valueProp] === value) {
                    return 'There are multiple properties mapped to this column.';
                  }
                }
                return '';
              },
              items: ([] as Array<{ text: string, value: string }>).concat(
                (propType.isOptional() 
                  ? [{ text: 'No Value', value: VALUE_NONE }] 
                  : []
                ),
                [{ text: 'Default Value', value: VALUE_DEFAULT }],
                [{ text: 'Dynamic Value', value: VALUE_DYNAMIC }],
                meta.fields.map((column) => ({
                  text: `Column "${column}"`,
                  value: column,
                })),
              ),
            } as SimpleFieldOption)),
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

      for (let rowIndex = 0; rowIndex < data.length; rowIndex++)
      {
        const row = data[rowIndex];
        const convert: any = {};

        objectEach(props, (propType, prop) => 
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

            case VALUE_DYNAMIC:
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
      }

      for (const prop in props)
      {
        const mapping = settings.mappings[prop];

        if (mapping === VALUE_DYNAMIC)
        {
          const programResult = await getProgram({
            title: 'Dynamic Value',
            registry,
            context: type,
            expectedType: props[prop],
          });

          if (!programResult)
          {
            return await sendNotification(({ message: 'CSV Import canceled.' }));
          }

          const cmd = LiveRuntime.getCommand(programResult.program);

          for (const row of data)
          {
            row[prop] = cmd(row);
          }
        }
      }

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
          pref: PREF_DATA_IMPORT_CONVERT,
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

export function getColumnValues(data: any[], column: string)
{
  return data.map((row) => row[column] || '');
}

