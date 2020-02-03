import { objectValues } from 'expangine-runtime';
import { getSimpleInput } from './SimpleInput';
import { exportFile } from './FileExport';
import { Project, ProjectTranscoders } from './Project';
import { friendlyList } from '@/common';


export interface ProjectExportOptions
{
  project: Project;
  transcoders: ProjectTranscoders;
}

export async function getProjectExport({ project, transcoders }: ProjectExportOptions): Promise<true | string>
{
  const settings = await getSimpleInput({
    title: 'Export',
    confirm: 'Export',
    unconfirm: 'Cancel',
    value: {
      name: project.metadata && project.metadata.title
        ? project.metadata.title + '-' + Date.now()
        : 'export-' + Date.now(),
      metadata: true,
      type: true,
      settings: true,
      data: true,
      program: true,
      functions: true,
      aliased: true,
      relations: true,
      compressed: false,
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
