import Vue from 'vue';
import { Type, ObjectType, objectValues, FunctionType, AnyType, ReturnExpression } from 'expangine-runtime';
import { SimpleFieldOption } from '@/common';
import { getSimpleInput } from './SimpleInput';
import { Registry } from '@/runtime/Registry';
import { ProjectTranscoders, ProjectType, ProjectTransformer } from './Project';


export interface ProjectImportOptions
{
  imported: any;
  accept: Record<ProjectType, boolean>;
  customize: boolean;
  type: Type;
  registry: Registry;
  transcoders: ProjectTranscoders;
}

export interface ProjectImportResult<T extends ProjectType = ProjectType>
{
  importing: T[];
  transform: ProjectTransformer;
}

interface ProjectPromptValue 
{
  metadata: boolean;
  type: 'ignore' | 'replace' | 'merge';
  typeMergeName: string;
  settings: boolean;
  data: 'ignore' | 'merge' | 'replace';
  program: 'ignore' | 'saveas' | 'replace';
  programFunctionName: string;
  functions: 'ignore' | 'mergeReplace' | 'mergeIgnore' | 'replace';
}

export async function getProjectImport({ imported, accept, customize, registry, type, transcoders }: ProjectImportOptions): Promise<ProjectImportResult | string>
{
  const currentObject = type instanceof ObjectType;
  const fields: Record<string, SimpleFieldOption> = {};

  let value: ProjectPromptValue = 
  {
    metadata: false,
    type: 'ignore',
    typeMergeName: 'imported_data',
    settings: false,
    data: 'ignore',
    program: 'ignore',
    programFunctionName: 'imported_function',
    functions: 'ignore',
  };

  if (accept.metadata && imported.metadata) 
  {
    value.metadata = true;
    fields.metadata = { name: 'metadata', type: 'boolean', label: 'Metadata' };
  }

  if (accept.data && imported.data !== undefined) 
  {
    fields.data = { name: 'data', type: 'select', label: 'Data', required: true, items: [
      { text: 'Ignore data', value: 'ignore' },
    ]};
  }

  if (accept.type && imported.type) 
  {
    value.type = 'replace';
    fields.type = { name: 'type', type: 'select', label: 'Type', required: true, items: [
      { text: 'Replace type', value: 'replace' },
      { text: 'Ignore type', value: 'ignore' },
    ]};
    
    if (currentObject && fields.type.items) 
    {
      fields.type.items.push({ text: 'Add imported type as property of current type', value: 'merge' });
      fields.typeMergeName = { name: 'typeMergeName', type: 'text', label: 'Property', details: 'Only applicable if "Type" is "Add imported type..."' };
    }

    if (accept.data && imported.data !== undefined && fields.data.items) 
    {
      fields.data.items.push({ text: 'Replace or merge data', value: 'merge' });
      value.data = 'merge';
    }
  }

  if (accept.settings && imported.settings) 
  {
    value.settings = true;
    fields.settings = { name: 'settings', type: 'boolean', label: 'Settings', required: true };
  }

  if (accept.data && imported.data !== undefined) 
  {
    const parsed = transcoders.data.decode(imported.data);
    
    if (type.isValid(parsed) && fields.data.items) 
    {
      fields.data.items.push({ text: 'Repace data', value: 'replace' });
      if (value.data === 'ignore') {
        value.data = 'replace';
      }
    }
  }

  if (accept.program && imported.program) 
  {
    value.program = 'replace';
    fields.program = { name: 'program', type: 'select', label: 'Program', required: true, items: [
      { text: 'Replace program', value: 'replace' },
      { text: 'Ignore program', value: 'ignore' },
    ]};

    if (accept.type && imported.type && fields.program.items) 
    {
      fields.program.items.push({ text: 'Save program as function', value: 'saveas' });
      fields.programFunctionName = { name: 'programFunctionName', type: 'text', label: 'Function Name', details: 'Only applicable if "Program" is "Save program as function"' };
    }
  }

  if (accept.functions && imported.functions) 
  {
    value.functions = 'replace';
    fields.functions = { name: 'functions', type: 'select', label: 'Functions', required: true, items: [
      { text: 'Replace functions', value: 'replace' },
      { text: 'Merge functions, replace existing', value: 'mergeReplace' },
      { text: 'Merge functions, ignore existing', value: 'mergeIgnore' },
      { text: 'Ignore functions', value: 'ignore' },
    ]};
  }

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

    if (value.type === 'merge' && (!value.typeMergeName || (type instanceof ObjectType && type.options.props[value.typeMergeName]))) 
    {
      return 'Import canceled, if you want to merge a type you need to name a unique property.';
    }

    if (value.program === 'saveas' && (!value.programFunctionName || (registry.defs.functions[value.programFunctionName]))) 
    {
      return 'Import canceled, if you want to save the program as a function you need to supply a unique function name.';
    }

    value = newValue;
  }

  const importing: ProjectType[] = [];

  if (value.type !== 'ignore') 
  {
    importing.push('type');
  }
  if (value.settings) 
  {
    importing.push('settings');
  }
  if (value.data !== 'ignore') 
  {
    importing.push('data');
  }
  if (value.program !== 'ignore') 
  {
    importing.push('program');
  }
  if (value.functions !== 'ignore' || value.program === 'saveas') 
  {
    importing.push('functions');
  }

  const transform: ProjectTransformer = {
    type: (x) => x.type,
    settings: (x) => x.settings,
    data: (x) => x.data,
    program: (x) => x.program,
    functions: (x) => x.functions,
    metadata: (x) => x.metadata,
  };

  switch (value.type) 
  {
    case 'replace':
      transform.type = () => transcoders.type.decode(imported.type);
      if (value.settings) {
        transform.settings = () => transcoders.settings.decode(imported.settings);
      } else {
        transform.settings = () => transcoders.settings.getDefault();
      }
      if (value.data !== 'ignore') {
        transform.data = () => transcoders.data.decode(imported.data);
      }
      break;

    case 'merge':
      const importedType = transcoders.type.decode(imported.type);

      transform.type = (project) => {
        if (project.type instanceof ObjectType) {
          Vue.set(project.type.options.props, value.typeMergeName, importedType);
        }
        return project.type;
      };

      transform.settings = (project) => {
        if (value.settings) {
          Vue.set((project.settings as any).sub, value.typeMergeName, transcoders.settings.decode(imported.settings));
        } else {
          Vue.set((project.settings as any).sub, value.typeMergeName, registry.getTypeSettings(importedType));
        }

        return project.settings;
      };

      if (value.data !== 'ignore') {
        transform.data = (project) => {
          Vue.set(project.data, value.typeMergeName, transcoders.data.decode(imported.data));

          return project.data;
        };
      }
      break;

    default:
      if (value.data !== 'ignore') {
        transform.data = () => transcoders.data.decode(imported.data);
      }
      break;
  }

  switch (value.functions) 
  {
    case 'replace':
      transform.functions = () => transcoders.functions.decode(imported.functions);
      break;
    case 'mergeReplace':
      const mergeReplace = transcoders.functions.decode(imported.functions);
      transform.functions = (project) => {
        for (const functionName in mergeReplace) {
          Vue.set(project.functions, functionName, mergeReplace[functionName]);
        }
        return project.functions;
      };
      break;
    case 'mergeIgnore':
      const mergeIgnore = transcoders.functions.decode(imported.functions);
      transform.functions = (project) => {
        for (const functionName in mergeIgnore) {
          if (!project.functions[functionName]) {
            Vue.set(project.functions, functionName, mergeIgnore[functionName]);
          }
        }
        return project.functions;
      };
      break;
  }

  switch (value.program) {
    case 'replace':
      transform.program = () => transcoders.program.decode(imported.program);
      break;
    case 'saveas':
      const existingFunctions = transform.functions;
      const program = transcoders.program.decode(imported.program);
      const params = transcoders.type.decode(imported.type);
      const returnType = program.getType(registry.defs, params) || AnyType.baseType;
      const expression = program instanceof ReturnExpression
        ? program
        : new ReturnExpression(program);

      transform.functions = (project) => {
        const functions = existingFunctions(project);
        if (program && params instanceof ObjectType) {
          Vue.set(functions, value.programFunctionName, new FunctionType({
            returnType,
            params, 
            expression,
          }));
        }
        return functions;
      };
      
      break;
  }

  if (value.metadata) {
    transform.metadata = () => transcoders.metadata.decode(imported.metadata);
  }

  return { importing, transform };
}
