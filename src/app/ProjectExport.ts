import { objectValues } from 'expangine-runtime';
import { getSimpleInput } from './SimpleInput';
import { exportFile } from './FileExport';
import { Project, ProjectTranscoders } from './Project';
import { friendlyList } from '@/common';
import { Preferences } from './Preference';


const PREF_NAME = Preferences.define({
  key: 'save_name',
  label: 'Save project name',
  defaultValue: '',
});

const PREF_METADATA = Preferences.define({
  key: 'save_metadata',
  label: 'Save project metadata',
  defaultValue: true,
});

const PREF_TYPE = Preferences.define({
  key: 'save_type',
  label: 'Save project designed type',
  defaultValue: true,
});

const PREF_SETTINGS = Preferences.define({
  key: 'save_settings',
  label: 'Save project designed type inputs',
  defaultValue: true,
});

const PREF_DATA = Preferences.define({
  key: 'save_data',
  label: 'Save project data',
  defaultValue: true,
});

const PREF_PROGRAM = Preferences.define({
  key: 'save_program',
  label: 'Save project program',
  defaultValue: true,
});

const PREF_FUNCTIONS = Preferences.define({
  key: 'save_functions',
  label: 'Save project functions',
  defaultValue: true,
});

const PREF_TYPES = Preferences.define({
  key: 'save_types',
  label: 'Save project types',
  defaultValue: true,
});

const PREF_RELATIONS = Preferences.define({
  key: 'save_types',
  label: 'Save project relations',
  defaultValue: true,
});

const PREF_COMPRESSED = Preferences.define({
  key: 'save_compressed',
  label: 'Save project in the compressed format',
  defaultValue: false,
});


export interface ProjectExportOptions
{
  project: Project;
  transcoders: ProjectTranscoders;
}

export async function getProjectExport({ project, transcoders }: ProjectExportOptions): Promise<true | string>
{
  const defaultName = project.metadata && project.metadata.title
    ? project.metadata.title + '-' + Date.now()
    : 'export-' + Date.now();

  const settings = await getSimpleInput({
    title: 'Export',
    confirm: 'Export',
    unconfirm: 'Cancel',
    value: {
      name: Preferences.get(PREF_NAME) || defaultName,
      metadata: Preferences.get(PREF_METADATA),
      type: Preferences.get(PREF_TYPE),
      settings: Preferences.get(PREF_SETTINGS),
      data: Preferences.get(PREF_DATA),
      program: Preferences.get(PREF_PROGRAM),
      functions: Preferences.get(PREF_FUNCTIONS),
      aliased: Preferences.get(PREF_TYPES),
      relations: Preferences.get(PREF_RELATIONS),
      compressed: Preferences.get(PREF_COMPRESSED),
    },
    fields: [
      { name: 'name', type: 'text', label: 'Export As', required: true, details: 'The name of the exported file, without .json extension.' },
      { name: 'metadata', type: 'boolean', label: 'Include Metadata', required: true, details: 'Export program name, description, and author?'},
      { name: 'type', type: 'boolean', label: 'Type', required: true, details: 'Export the designed data type?' },
      { name: 'settings', type: 'boolean', label: 'Type Visual Settings', required: true, details: 'Export the visual settings for your data (how your input looks in the Data tab).' },
      { name: 'data', type: 'boolean', label: 'Data', required: true },
      { name: 'program', type: 'boolean', label: 'Program', required: true },
      { name: 'functions', type: 'boolean', label: 'Functions', required: true, details: friendlyList(objectValues(project.functions, (f, name) => name)) },
      { name: 'aliased', type: 'boolean', label: 'Types', required: true, details: friendlyList(objectValues(project.aliased, (f, name) => name)) },
      { name: 'relations', type: 'boolean', label: 'Relations', required: true, details: friendlyList(objectValues(project.relations, (f, name) => name)) },
      { name: 'compressed', type: 'boolean', label: 'Compress' },
    ],
  });

  if (!settings || !settings.name) 
  { 
    return 'Export canceled.';
  }

  const exporting: any = {};

  if (settings.metadata) {
    exporting.metadata = transcoders.metadata.encode(project.metadata);
  }
  if (settings.type) {
    exporting.type = transcoders.type.encode(project.type);
  }
  if (settings.settings) {
    exporting.settings = transcoders.settings.encode(project.settings);
  }
  if (settings.data) {
    exporting.data = transcoders.data.encode(project.data);
  }
  if (settings.program) {
    exporting.program = transcoders.program.encode(project.program);
  }
  if (settings.functions) {
    exporting.functions = transcoders.functions.encode(project.functions);
  }
  if (settings.aliased) {
    exporting.aliased = transcoders.aliased.encode(project.aliased);
    exporting.aliasedSettings = transcoders.aliasedSettings.encode(project.aliasedSettings);
    exporting.aliasedData = transcoders.aliasedData.encode(project.aliasedData);
    exporting.storage = transcoders.storage.encode(project.storage);
  }
  if (settings.relations) {
    exporting.relations = transcoders.relations.encode(project.relations);
  }

  Preferences.set(PREF_NAME, settings.name);
  Preferences.set(PREF_METADATA, settings.metadata);
  Preferences.set(PREF_TYPE, settings.type);
  Preferences.set(PREF_SETTINGS, settings.settings);
  Preferences.set(PREF_DATA, settings.data),
  Preferences.set(PREF_PROGRAM, settings.program);
  Preferences.set(PREF_FUNCTIONS, settings.functions);
  Preferences.set(PREF_TYPES, settings.aliased);
  Preferences.set(PREF_RELATIONS, settings.relations);
  Preferences.set(PREF_COMPRESSED, settings.compressed);

  const exported = settings.compressed
    ? JSON.stringify(exporting)
    : JSON.stringify(exporting, undefined, 2);

  await exportFile({
    name: settings.name + '.json',
    content: exported,
    type: 'text/json',
  });

  return true;
}
