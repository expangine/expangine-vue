import { BooleanOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(BooleanOps.create, {
    name: 'Create Boolean',
    description: 'Create a Boolean value (false)',
    singleline: 'false',
    comments: {},
    returnComments: 'false',
  });

  registry.addOperation(BooleanOps.maybe, {
    name: 'Try Boolean?',
    description: 'If the [value] is boolean, return the boolean value, otherwise return undefined',
    singleline: '{value} to boolean?',
    comments: {
      value: 'The value to convert to boolean or undefined',
    },
    returnComments: 'Boolean or undefined',
  });

  registry.addOperation(BooleanOps.and, {
    name: 'And',
    description: 'Return true if both [a] and [b] are true',
    singleline: '{a} and {b}',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
    returnComments: 'True if [a] and [b] are true, otherwise false.',
  });

  registry.addOperation(BooleanOps.or, {
    name: 'Or',
    description: 'Return true if either [a] or [b] are true',
    singleline: '{a} or {b}',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
    returnComments: 'True if [a] or [b] are true, otherwise false.',
  });

  registry.addOperation(BooleanOps.xor, {
    name: 'Xor',
    description: 'Return true if either [a] or [b] are true but not both',
    singleline: '{a} or {b} but not both',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
    returnComments: 'True if [a] or [b] are true but not both, otherwise false.',
  });

  registry.addOperation(BooleanOps.not, {
    name: 'Not',
    description: 'Return true if [a] is false',
    singleline: '!{a}',
    comments: {
      a: 'The value to negate',
    },
    returnComments: 'True if [a] is false, otherwise false.',
  });

  registry.addOperation(BooleanOps.cmp, {
    name: 'Compare Boolean',
    description: 'Compare [value] and [test] and return a number result',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The value to compare',
      test: 'The test value to compare against',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] < [test] and a positive number when [value] > [test].',
  });

  registry.addOperation(BooleanOps.isValid, {
    name: 'Is Boolean?',
    description: 'Determines whether [value] is a valid value for Boolean',
    singleline: 'is {value} boolean?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is a boolean value, otherwise false.',
  });

  registry.addOperation(BooleanOps.isTrue, {
    name: 'Is True?',
    description: 'Determines whether [value] is true',
    singleline: '{value} is true',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is true, otherwise false.',
  });

  registry.addOperation(BooleanOps.isFalse, {
    name: 'Is False?',
    description: 'Determines whether [value] is false',
    singleline: '{value} is false',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is false, otherwise false.',
  });

  registry.addOperation(BooleanOps.asAny, {
    name: 'Cast Boolean to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asBoolean, {
    name: 'Cast Boolean to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asColor, {
    name: 'Cast Boolean to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'White',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asDate, {
    name: 'Cast Boolean to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The current date & time.',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asList, {
    name: 'Cast Boolean to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The [value] converted to a list by returning it as a list with a single item.',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asMap, {
    name: 'Cast Boolean to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A map with a single key-value pair of "value" and [value]',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asNumber, {
    name: 'Cast Boolean to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If [value] is true return 1, otherwise 0.',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asObject, {
    name: 'Cast Boolean to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'An object with a single property "value" and [value]',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asText, {
    name: 'Cast Boolean to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '"true" or "false"',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asTuple, {
    name: 'Cast Boolean to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A tuple with a single [value] element.',
    weight: 0.5,
  });

  registry.addOperation(BooleanOps.asSet, {
    name: 'Cast Boolean to Set',
    description: 'Cast [value] to Set',
    singleline: '{value} as set',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A set with a single [value] value.',
    weight: 0.5,
  });

};
