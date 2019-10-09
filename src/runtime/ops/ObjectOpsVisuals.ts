import { ObjectOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(ObjectOps.create, {
    name: 'Create Object',
    description: 'Create a Object value (empty)',
    singleline: 'create object',
    comments: {},
  });

  registry.addOperation(ObjectOps.maybe, {
    name: 'Try Object?',
    description: 'If the [value] is object, return the object value, otherwise return undefined',
    singleline: '{value} to object?',
    comments: {
      value: 'The value to convert to object or undefined',
    },
  });

  registry.addOperation(ObjectOps.has, {
    name: 'Has Property',
    description: 'Check if an [object] has a property [key]',
    singleline: '{object} has {key}',
    comments: {
      object: 'The object to check for a property',
      key: 'The property to look for',
    },
  });

  registry.addOperation(ObjectOps.get, {
    name: 'Get Property',
    description: 'Get a value from property [key] from [object]',
    singleline: '{object} > {key}',
    comments: {
      object: 'The object to get a value from',
      key: 'The property of the value on the object',
    },
  });

  registry.addOperation(ObjectOps.set, {
    name: 'Set Property',
    description: 'Set a [value] for property [key] from [object]',
    singleline: '{object} > {key} = {value}',
    comments: {
      object: 'The object to get a value from',
      key: 'The property of the value on the object',
      value: 'The new value for the property',
    },
    scopeComments: {
      existingValue: 'The existing value of the property',
    },
  });

  registry.addOperation(ObjectOps.delete, {
    name: 'Delete Property',
    description: 'Delete the property [key] from [object]',
    singleline: 'delete {key} from {object}',
    comments: {
      object: 'The object to remove a property from',
      key: 'The key of the key/value pair to remove',
    },
  });

  registry.addOperation(ObjectOps.cmp, {
    name: 'Compare Objects',
    description: 'Compares objects [value] and [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The first object to compare',
      test: 'The second object to compare',
    },
  });

  registry.addOperation(ObjectOps.isValid, {
    name: 'Is Object?',
    description: 'Determines whether [value] is a valid value for Object',
    singleline: 'is {value} object?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(ObjectOps.isEqual, {
    name: 'Objects Equal?',
    description: 'Determines whether [value] is equal to [test]',
    singleline: '{value} equals {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
  });

  registry.addOperation(ObjectOps.isNotEqual, {
    name: 'Objects Not Equal?',
    description: 'Determines whether [value] is not equal to [test]',
    singleline: '{value} not equal to {test}',
    comments: {
      value: 'The map to evaluate',
      test: 'The test map to compare against',
    },
  });

  registry.addOperation(ObjectOps.isLess, {
    name: 'Is Object Less?',
    description: 'Determines whether [value] is less than [test]',
    singleline: '{value} < {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
  });

  registry.addOperation(ObjectOps.isLessOrEqual, {
    name: 'Is Object Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test]',
    singleline: '{value} <= {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
  });

  registry.addOperation(ObjectOps.isGreater, {
    name: 'Is Object Greater?',
    description: 'Determines whether [value] is greater than [test]',
    singleline: '{value} > {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
  });

  registry.addOperation(ObjectOps.isGreaterOrEqual, {
    name: 'Is Object Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test]',
    singleline: '{value} >= {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
  });


  registry.addOperation(ObjectOps.asAny, {
    name: 'Cast Object to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asBoolean, {
    name: 'Cast Object to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asList, {
    name: 'Cast Object to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asDate, {
    name: 'Cast Object to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asMap, {
    name: 'Cast Object to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asNumber, {
    name: 'Cast Object to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asObject, {
    name: 'Cast Object to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asText, {
    name: 'Cast Object to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(ObjectOps.asTuple, {
    name: 'Cast Object to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
  });

};
