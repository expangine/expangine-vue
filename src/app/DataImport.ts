
import Vue from 'vue';
import * as Papa from 'papaparse';
import { objectEach, TextType } from 'expangine-runtime';
import { getFile } from './FileImport';
import { getPromiser } from './Promiser';
import { getSimpleInput } from './SimpleInput';
import { Registry } from '@/runtime/Registry';
import { SimpleFieldOption, findClosestPhonetic, castValue } from '@/common';
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

    complete: async ({ data, meta }: { data: any, meta: { fields: string[], aborted: boolean }}) => 
    {
      if (meta.aborted)
      {
        return resolve('There was a problem parsing the CSV.');
      }

      const fields: SimpleFieldOption[] = [
        { name: 'property', type: 'text', label: 'Property', details: 'The property to store the CSV data in.' },
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
        },
        fields,
      });

      if (!settings) 
      {
        return resolve('CSV Import canceled.');
      }

      data.forEach((row: any) => {
        for (const prop in row) {
          if (!settings.columns[prop]) {
            delete row[prop];
          }
        }
      });

      if (settings.action === 'replace') 
      {
        data = { [settings.property]: data };

        const dataType = registry.defs.describe(data);
        dataType.removeDescribedRestrictions();
        
        const dataSettings = registry.getTypeSettings(dataType);

        resolve({
          transform: (project) => ({
            data,
            type: dataType,
            settings: dataSettings,
          }),
        });
      } 
      else 
      {
        const dataType = registry.defs.describe(data);
        dataType.removeDescribedRestrictions();

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
