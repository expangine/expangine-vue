import { objectValues, objectEach, isEmpty, Definitions } from 'expangine-runtime';
import { SimpleFieldOption } from '@/common';
import { getSimpleInput } from './SimpleInput';
import { Registry } from '@/runtime/Registry';
import { importData } from './ProjectVersions';
import { clearEntity, addEntity } from './EntityBuilders';
import { getFile } from './FileImport';
import { sendNotification } from './Notify';


export interface ProjectImportOptions
{
  imported: any;
  customize: boolean;
  registry: Registry;
}

export type ProjectImportResult = boolean;

interface ProjectPromptValue 
{
  import: 'mergeReplace' | 'mergeIgnore' | 'replace';
}

export async function getProjectImport({ imported, customize, registry }: ProjectImportOptions): Promise<ProjectImportResult | string>
{
  const fields: Record<string, SimpleFieldOption> = {};

  let value: ProjectPromptValue = 
  {
    import: 'replace',
  };

  fields.import = { name: 'import', type: 'select', label: 'Import', required: true, items: [
    { text: 'Replace', value: 'replace' },
    { text: 'Merge, replace existing', value: 'mergeReplace' },
    { text: 'Merge, ignore existing', value: 'mergeIgnore' },
  ]};

  if (customize) 
  {
    const newValue = await getSimpleInput<any>({
      title: 'Import Options',
      message: 'Actions to perform on import',
      confirm: 'Import',
      unconfirm: 'Cancel',
      value,
      fields: objectValues(fields),
    });

    if (!newValue) 
    {
      return 'Import canceled.';
    }

    value = newValue;
  }

  const clear = value.import === 'replace';
  const overwrite = value.import !== 'mergeIgnore';

  clearEntity(registry);

  importData(imported, registry.defs, clear, overwrite);

  registry.defs.entities.forEach((_, entityName) => addEntity(registry, entityName));

  return true;
}

export async function getNamedImport(prop: string, defs: Definitions)
{
  const file = await getFile({ json: true, accept: 'text/json' });

  if (file && file.json)
  {
    const trimmed = {
      version: file.json.version,
      [prop]: file.json[prop],
    };

    if (isEmpty(trimmed[prop]))
    {
      sendNotification({ message: 'There was nothing to import.' });
    }
    else
    {
      importData(trimmed, defs, false, true);
    }
  }
}
