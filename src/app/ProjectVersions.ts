import { Definitions, DefinitionsImportOptions, ProgramOptions, FuncOptions, EntityOptions } from 'expangine-runtime';
import { obj } from '@/common';

export const VERSION = 2;

export function importData(data: any, defs: Definitions, clear: boolean, overwrite: boolean)
{
  const version = data.version || 1;

  if (clear) {
    defs.clearRelations();
    defs.clearEntities();
    defs.clearFunctions();
    defs.clearPrograms();
    defs.clearData();
  }

  switch (version) {
    case 1: return importDataVersion1(data, defs, overwrite);
    case 2: return importDataVersion2(data, defs, overwrite);
    default:
      throw Error('Invalid version number');
  }
}

export function importDataVersion1(rawData: any, defs: Definitions, overwrite: boolean)
{
  const data = rawData as {
    metadata?: {
      title?: string;
      description?: string;
      author?: string;
      created?: string;
    };
    type?: any;
    data?: any;
    settings?: any;
    program?: any;
    functions?: Record<string, ['func', string, any, any]>;
    storage?: Record<string, {
      key: any;
      describe: any;
      transcoders: Record<string, any>;
      indexes: Record<string, any>;
    }>;
    relations?: Record<string, any>;
    aliased?: Record<string, any>;
    aliasedData?: Record<string, any[]>;
    aliasedSettings?: Record<string, any>;
  };

  const now = new Date().getTime();
  const program: Partial<ProgramOptions> & { name: string } = {
    name: 'Main',
  };

  if (data.metadata) {
    if (data.metadata.title) {
      program.name = data.metadata.title;
    }
    if (data.metadata.author) {
      program.author = data.metadata.author;
    }
    if (data.metadata.description) {
      program.description = data.metadata.description;
    }
    if (data.metadata.created) {
      program.updated = program.created = Date.parse(data.metadata.created);
    }
  }

  if (!overwrite) {
    let programCount = 1;
    while (defs.getProgram(program.name + programCount)) {
      programCount++;
    }

    program.name = program.name + programCount;
  }  

  if (data.settings) {
    program.meta = data.settings;
  }

  if (data.program) {
    program.expression = data.program;
  }

  if (data.type) {
    program.dataType = data.type;
  }

  if (data.data) {
    program.datasets = [{
      name: 'Data Set #1',
      data: data.data,
      created: now,
      updated: now,
      meta: null,
    }];
  }
  
  if (data.functions) {
    for (const functionName in data.functions) {
      if (!overwrite && defs.getFunction(functionName)) {
        continue;
      }

      const funcData = data.functions[functionName];
      
      defs.addFunction({
        name: functionName,
        params: funcData[2],
        expression: funcData[3],
      });
    }
  }

  if (data.aliased) {
    for (const entityName in data.aliased) {

      if (!overwrite && defs.getEntity(entityName)) {
        continue;
      }

      const entityOptions: Partial<EntityOptions> = {
        name: entityName,
        type: data.aliased[entityName],
      };

      if (data.aliasedSettings && entityName in data.aliasedSettings) {
        entityOptions.meta = data.aliasedSettings[entityName];
      }

      if (data.aliasedData && entityName in data.aliasedData) {
        entityOptions.instances = data.aliasedData[entityName];
      }

      if (data.storage && entityName in data.storage) {
        const { key, describe, transcoders, indexes } = data.storage[entityName];

        entityOptions.key = key;
        entityOptions.describe = describe;
        entityOptions.transcoders = transcoders;
        entityOptions.indexes = indexes;
      }

      defs.addEntity(entityOptions);
    }
  }

  if (data.relations) {
    for (const relationName in data.relations) {
      
      if (!overwrite && defs.getRelation(relationName)) {
        continue;
      }

      defs.addRelation(data.relations[relationName]);
    }
  }

  if (data.type || data.data || data.program || data.settings) {
    defs.addProgram(program);
  }

  return true;
}

export function importDataVersion2(rawData: any, defs: Definitions, overwrite: boolean)
{
  const data = rawData as DefinitionsImportOptions;

  if (data.functions) {
    for (const functionName in data.functions) {
      if (!overwrite && defs.getFunction(functionName)) {
        continue;
      }

      defs.addFunction(data.functions[functionName]);
    }
  }

  if (data.entities) {
    for (const entityName in data.entities) {
      if (!overwrite && defs.getEntity(entityName)) {
        continue;
      }

      defs.addEntity(data.entities[entityName]);
    }
  }

  if (data.data) {
    for (const dataName in data.data) {
      if (!overwrite && defs.getData(dataName)) {
        continue;
      }

      defs.addData(data.data[dataName]);
    }
  }

  if (data.relations) {
    for (const relationName in data.relations) {
      if (!overwrite && defs.getRelation(relationName)) {
        continue;
      }

      defs.addRelation(data.relations[relationName]);
    }
  }

  if (data.programs) {
    for (const programName in data.programs) {
      if (!overwrite && defs.getProgram(programName)) {
        continue;
      }

      defs.addProgram(data.programs[programName]);
    }
  }

  return true;
}
