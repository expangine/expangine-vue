import { ObjectOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(ObjectOps.create, {
    name: 'Create Object',
    description: 'Create a Object value (empty)',
    singleline: 'create object',
    comments: {},
    returnComments: '{}',
  });

  registry.addOperation(ObjectOps.maybe, {
    name: 'Try Object?',
    description: 'If the [value] is object, return the object value, otherwise return undefined',
    singleline: '{value} to object?',
    comments: {
      value: 'The value to convert to object or undefined',
    },
    returnComments: 'object or undefine',
  });

  registry.addOperation(ObjectOps.has, {
    name: 'Has Property',
    description: 'Check if an [object] has a property [key]',
    singleline: '{object} has {key}',
    comments: {
      object: 'The object to check for a property',
      key: 'The property to look for',
    },
    returnComments: 'True if [object] has the property [key], otherwise false.',
  });

  registry.addOperation(ObjectOps.get, {
    name: 'Get Property',
    description: 'Get a value from property [key] from [object]',
    singleline: '{object} > {key}',
    comments: {
      object: 'The object to get a value from',
      key: 'The property of the value on the object',
    },
    returnComments: 'The value of the property [key], or undefined if none exists.',
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
    returnComments: '[object]',
  });

  registry.addOperation(ObjectOps.delete, {
    name: 'Delete Property',
    description: 'Delete the property [key] from [object]',
    singleline: 'delete {key} from {object}',
    comments: {
      object: 'The object to remove a property from',
      key: 'The key of the key/value pair to remove',
    },
    returnComments: 'The value deleted, or undefined if it did not exist.',
  });

  registry.addOperation(ObjectOps.cmp, {
    name: 'Compare Objects',
    description: 'Compares objects [value] and [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The first object to compare',
      test: 'The second object to compare',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] has properties [test] does not and a positive number when [value] is missing properties that [test] has.',
  });

  registry.addOperation(ObjectOps.isValid, {
    name: 'Is Object?',
    description: 'Determines whether [value] is a valid value for Object',
    singleline: 'is {value} object?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is an object, otherwise false.',
  });

  registry.addOperation(ObjectOps.isEqual, {
    name: 'Objects Equal?',
    description: 'Determines whether [value] is equal to [test]',
    singleline: '{value} equals {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
    returnComments: 'True if [value] equals [test], otherwise false',
  });

  registry.addOperation(ObjectOps.isNotEqual, {
    name: 'Objects Not Equal?',
    description: 'Determines whether [value] is not equal to [test]',
    singleline: '{value} not equal to {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
    returnComments: 'True if [value] is not equal to [test], otherwise false',
  });

  registry.addOperation(ObjectOps.isLess, {
    name: 'Is Object Less?',
    description: 'Determines whether [value] is less than [test]',
    singleline: '{value} < {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
    returnComments: 'True if [value] is less than [test], otherwise false.',
  });

  registry.addOperation(ObjectOps.isLessOrEqual, {
    name: 'Is Object Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test]',
    singleline: '{value} <= {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
    returnComments: 'True if [value] is less than or equal to [test], otherwise false.',
  });

  registry.addOperation(ObjectOps.isGreater, {
    name: 'Is Object Greater?',
    description: 'Determines whether [value] is greater than [test]',
    singleline: '{value} > {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
    returnComments: 'True if [value] is greater than [test], otherwise false.',
  });

  registry.addOperation(ObjectOps.isGreaterOrEqual, {
    name: 'Is Object Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test]',
    singleline: '{value} >= {test}',
    comments: {
      value: 'The object to evaluate',
      test: 'The test object to compare against',
    },
    returnComments: 'True if [value] is greater than or equal to [test], otherwise false.',
  });

  registry.addOperation(ObjectOps.asAny, {
    name: 'Cast Object to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

  registry.addOperation(ObjectOps.asBoolean, {
    name: 'Cast Object to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] has a boolean property "value" it is returned, otherwise true.',
  });

  registry.addOperation(ObjectOps.asColor, {
    name: 'Cast Object to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] is a color it is returned. If [value] has a boolean property "value" it is returned, otherwise white.',
  });

  registry.addOperation(ObjectOps.asList, {
    name: 'Cast Object to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] has a list property "value" it is returned, otherwise [value] converted to a list by returning it as a list with a single item.',
  });

  registry.addOperation(ObjectOps.asDate, {
    name: 'Cast Object to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] has a date property "value" it is returned, otherwise the current date & time.',
  });

  registry.addOperation(ObjectOps.asMap, {
    name: 'Cast Object to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] has a map property "value" it is returned, otherwise a map with a single key-value pair of "value" and [value].',
  });

  registry.addOperation(ObjectOps.asNumber, {
    name: 'Cast Object to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] has a number property "value" it is returned, otherwise 0.',
  });

  registry.addOperation(ObjectOps.asObject, {
    name: 'Cast Object to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

  registry.addOperation(ObjectOps.asText, {
    name: 'Cast Object to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] has a text property "value" it is returned, otherwise [value] in text form.',
  });

  registry.addOperation(ObjectOps.asTuple, {
    name: 'Cast Object to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] has a date property "value" it is returned, otherwise a tuple with a single [value] element.',
  });

};
