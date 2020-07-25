import { EntityOps, Exprs } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(EntityOps.newInstance, {
    name: 'Create a Type instance',
    description: 'Create a new instance of the Type [name].',
    singleline: 'new {name} with {initial}',
    comments: {
      name: 'The name of the Type to create',
      initial: 'The initial values of the Type',
    },
    returnComments: 'A new instance of [name] with [initial].',
    defaults: {
      initial: 'default values',
    },
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.get, {
    name: 'Get Type instances',
    description: 'Get the instances of [name] Type, optionally [where]',
    singleline: 'get {name} {where}',
    comments: {
      name: 'The name of the Type',
      where: 'Only return an instance when this is true',
    },
    scopeComments: {
      instance: 'The current instance to test',
    },
    defaults: {
      where: 'all',
    },
    returnComments: 'The list of instances of [name].',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.getKey, {
    name: 'Get identifier of an Type',
    description: 'Get the unique identifier of an [name] Type [instance]',
    singleline: 'identifier of {name} {instance}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
    },
    returnComments: 'The unique identifier of the instance.',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.remove, {
    name: 'Remove an Type',
    description: 'Removes the [name] Type [instance] from the system',
    singleline: 'remove {name} {instance}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
    },
    returnComments: 'True if the Type instance was removed.',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.save, {
    name: 'Save an Type',
    description: 'Saves the [name] Type [instance] to the system',
    singleline: 'save {name} {instance}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
    },
    returnComments: 'True if the Type instance was saved.',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.getRelated, {
    name: 'Get related types(s)',
    description: 'Get the [relation] type(s) on the [name] Type [instance]',
    singleline: 'get {name} {instance} {relation}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
      relation: 'The relation on the Type',
    },
    returnComments: 'The related type instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.isRelated, {
    name: 'Are Type related?',
    description: 'Is the [name] Type [instance] related to [related] over [relation]',
    singleline: 'does {name} {instance} have {relation} {related}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
      relation: 'The relation on the Type',
      related: 'The related instance to check for',
    },
    returnComments: 'True if the [related] instance is related to [instance].',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.setRelated, {
    name: 'Set related Type(s)',
    description: 'Sets the [name] Type [instance] relation to [related], removing or adding references where necessary.',
    singleline: 'set {name} {instance} {relation} to {related}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
      relation: 'The relation on the Type',
      related: 'The related instance(s) to set',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to relate the given instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });
  
  registry.addOperation(EntityOps.addRelated, {
    name: 'Add related Type(s)',
    description: 'Adds [related] to the [relation] on the [name] Type [instance]',
    singleline: '{name} {instance} add {relation} {related}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
      relation: 'The relation on the Type',
      related: 'The related instance(s) to add',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to relate the given instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.removeRelated, {
    name: 'Remove related Type(s)',
    description: 'Removes [related] to the [relation] on the [name] Type [instance]',
    singleline: '{name} {instance} remove {relation} {related}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
      relation: 'The relation on the Type',
      related: 'The related instance(s) to remove',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to unrelate the given instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.clearRelated, {
    name: 'Clear related Type(s)',
    description: 'Clears [relation] on the [name] Type [instance]',
    singleline: '{name} {instance} clear {relation}',
    comments: {
      name: 'The name of the Type',
      instance: 'The Type instance',
      relation: 'The relation on the Type',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to unrelate all related instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

};
