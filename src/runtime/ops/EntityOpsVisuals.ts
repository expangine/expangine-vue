import { EntityOps, Exprs } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(EntityOps.newInstance, {
    name: 'Create a Entity instance',
    description: 'Create a new instance of the Entity [name].',
    singleline: 'new {name}',
    comments: {
      name: 'The name of the Entity to create',
    },
    returnComments: 'A new instance of [name].',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.get, {
    name: 'Get Entity instances',
    description: 'Get the instances of [name] Entity, optionally [where]',
    singleline: 'get {name} {where}',
    comments: {
      name: 'The name of the Entity',
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
    name: 'Get identifier of an Entity',
    description: 'Get the unique identifier of an [name] Entity [instance]',
    singleline: 'identifier of {name} {instance}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
    },
    returnComments: 'The unique identifier of the instance.',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.remove, {
    name: 'Remove an Entity',
    description: 'Removes the [name] Entity [instance] from the system',
    singleline: 'remove {name} {instance}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
    },
    returnComments: 'True if the Entity instance was removed.',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.save, {
    name: 'Save an Entity',
    description: 'Saves the [name] Entity [instance] to the system',
    singleline: 'save {name} {instance}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
    },
    returnComments: 'True if the Entity instance was saved.',
    initialParams: () => ({ 
      name: Exprs.entity(''),
    }),
  });

  registry.addOperation(EntityOps.getRelated, {
    name: 'Get related entity(s)',
    description: 'Get the [relation] entity(s) on the [name] Entity [instance]',
    singleline: 'get {name} {instance} {relation}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
      relation: 'The relation on the Entity',
    },
    returnComments: 'The related entity instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.isRelated, {
    name: 'Are Entity related?',
    description: 'Is the [name] Entity [instance] related to [related] over [relation]',
    singleline: 'does {name} {instance} have {relation} {related}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
      relation: 'The relation on the Entity',
      related: 'The related instance to check for',
    },
    returnComments: 'True if the [related] instance is related to [instance].',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.setRelated, {
    name: 'Set related Entity(s)',
    description: 'Sets the [name] Entity [instance] relation to [related], removing or adding references where necessary.',
    singleline: 'set {name} {instance} {relation} to {related}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
      relation: 'The relation on the Entity',
      related: 'The related instance(s) to set',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to relate the given instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });
  
  registry.addOperation(EntityOps.addRelated, {
    name: 'Add related Entity(s)',
    description: 'Adds [related] to the [relation] on the [name] Entity [instance]',
    singleline: '{name} {instance} add {relation} {related}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
      relation: 'The relation on the Entity',
      related: 'The related instance(s) to add',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to relate the given instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.removeRelated, {
    name: 'Remove related Entity(s)',
    description: 'Removes [related] to the [relation] on the [name] Entity [instance]',
    singleline: '{name} {instance} remove {relation} {related}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
      relation: 'The relation on the Entity',
      related: 'The related instance(s) to remove',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to unrelate the given instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

  registry.addOperation(EntityOps.clearRelated, {
    name: 'Clear related Entity(s)',
    description: 'Clears [relation] on the [name] Entity [instance]',
    singleline: '{name} {instance} clear {relation}',
    comments: {
      name: 'The name of the Entity',
      instance: 'The Entity instance',
      relation: 'The relation on the Entity',
    },
    returnComments: 'The number of changes made (relations, unrelations, removals) to unrelate all related instance(s).',
    initialParams: () => ({ 
      name: Exprs.entity(''),
      relation: Exprs.relation(''),
    }),
  });

};
