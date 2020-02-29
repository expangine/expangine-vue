import { NamedMap, Definitions, Types, EnumType, objectMap } from 'expangine-runtime';
import { getSimpleInput } from './SimpleInput';
import { exportFile } from './FileExport';
import { Preferences, PreferenceCategory } from './Preference';
import { VERSION } from './ProjectVersions';


const PREF_NAME = Preferences.define({
  key: 'save_name',
  label: 'Save project name',
  category: [PreferenceCategory.SAVE],
  defaultValue: '',
});

const PREF_TYPE = Preferences.define({
  key: 'save_type',
  label: 'Save project export type',
  category: [PreferenceCategory.SAVE],
  defaultValue: 'all' as 'all' | 'entity' | 'entityRelation' | 'entityRelationFunction' | 'functions' | 'functionsData',
  type: Types.enumForText([
    ['Everything', 'all'], 
    ['Data & Entities', 'entity'], 
    ['Data, Entity, & Relations', 'entityRelation'], 
    ['Data, Entity, Relations, & Functions', 'entityRelationFunction'], 
    ['Functions Only', 'functions'],
    ['Data & Functions', 'functionsData'],
  ]),
});

const PREF_COMPRESSED = Preferences.define({
  key: 'save_compressed',
  label: 'Save project in the compressed format',
  category: [PreferenceCategory.SAVE],
  defaultValue: false,
});


export interface ProjectExportOptions
{
  defs: Definitions;
}

export async function getProjectExport({ defs }: ProjectExportOptions): Promise<true | string>
{
  const defaultName = defs.programs.keys.join('-') + Date.now();

  const settings = await getSimpleInput({
    title: 'Export',
    confirm: 'Export',
    unconfirm: 'Cancel',
    value: {
      name: Preferences.get(PREF_NAME) || defaultName,
      type: Preferences.get(PREF_TYPE),
      compressed: Preferences.get(PREF_COMPRESSED),
    },
    fields: [
      { name: 'name', type: 'text', label: 'Export As', required: true, details: 'The name of the exported file, without .json extension.' },
      { name: 'type', type: 'select', label: 'Export', required: true, details: 'What should be exported?',
        items: Array.from((PREF_TYPE.type as EnumType).options.constants.entries()).map(([text, value]) => ({
          text,
          value,
       })),
      },
      { name: 'compressed', type: 'boolean', label: 'Compress' },
    ],
  });

  if (!settings || !settings.name) 
  { 
    return 'Export canceled.';
  }

  const exporting: any = defs.export();

  if (settings.type !== 'all') {
    delete exporting.programs;
  }
  if (settings.type !== 'all' && settings.type !== 'functions' && settings.type !== 'entityRelationFunction') {
    delete exporting.functions;
  }
  if (settings.type !== 'all' && settings.type !== 'entityRelation' && settings.type !== 'entityRelationFunction') {
    delete exporting.relations;
  }
  if (settings.type === 'functions') {
    delete exporting.data;
  }

  exporting.version = VERSION;

  const exported = settings.compressed
    ? JSON.stringify(exporting)
    : JSON.stringify(exporting, undefined, 2);

  await exportFile({
    name: settings.name + '.json',
    content: exported,
    type: 'text/json',
  });

  Preferences.set(PREF_NAME, settings.name);
  Preferences.set(PREF_TYPE, settings.type);
  Preferences.set(PREF_COMPRESSED, settings.compressed);

  return true;
}

export async function getNamedExport(prop: string, value: { name: string, encode: () => any }, space: string | number | undefined = 2)
{
  const exported = {
    version: VERSION,
    [prop]: { [value.name]: value.encode() },
  };

  await exportFile({
    name: value.name + '.json',
    content: JSON.stringify(exported, undefined, space),
    type: 'text/json',
  });
}

export async function getNamedMapExport(prop: string, map: NamedMap<{ name: string, encode: () => any }>, space: string | number | undefined = 2)
{
  const exported = {
    version: VERSION,
    [prop]: objectMap(map.toObject(), (v) => v.encode()),
  };

  await exportFile({
    name: map.keys.join('-') + '.json',
    content: JSON.stringify(exported, undefined, space),
    type: 'text/json',
  });
}
