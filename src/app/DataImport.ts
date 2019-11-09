
import Vue from 'vue';
import * as Papa from 'papaparse';
import { getFile } from './FileImport';
import { getPromiser } from './Promiser';
import { getSimpleInput } from './SimpleInput';
import { Registry } from '@/runtime/Registry';
import { SimpleFieldOption } from '@/common';
import { Project } from './Project';
import { Type, ObjectType } from 'expangine-runtime';
import { TypeSettingsRecord } from '@/runtime/types/TypeVisuals';



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
