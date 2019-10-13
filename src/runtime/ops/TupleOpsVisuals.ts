import { TupleOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(TupleOps.create, {
    name: 'Create Tuple',
    description: 'Create a Tuple value (empty)',
    singleline: 'create tuple',
    comments: {},
    returnComments: '[]',
  });

  registry.addOperation(TupleOps.maybe, {
    name: 'Try Tuple?',
    description: 'If the [value] is tuple, return the tuple value, otherwise return undefined',
    singleline: '{value} to tuple?',
    comments: {
      value: 'The value to convert to tuple or undefined',
    },
    returnComments: 'tuple or undefined.',
  });

  registry.addOperation(TupleOps.cmp, {
    name: 'Compare Tuples',
    description: 'Compares tuples [value] and [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The first tuple to compare',
      test: 'The second tuple to compare',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] < [test] and a positive number when [value] > [test].',
  });

  registry.addOperation(TupleOps.copy, {
    name: 'Copy Tuple',
    description: 'Copy tuple [value]',
    singleline: 'copy {value}',
    comments: {
      value: 'The tuple to copy',
    },
    returnComments: 'A copy of the tuple.',
  });

  registry.addOperation(TupleOps.get, {
    name: 'Get Element',
    description: 'Get an element from tuple [value] at [index]',
    singleline: 'element {index} in {value}',
    comments: {
      value: 'The tuple to get an element from',
      index: 'The index of the element',
    },
    returnComments: 'The element at the given [index], or undefined if none exists.',
  });

  registry.addOperation(TupleOps.set, {
    name: 'Set Element',
    description: 'Set an element in tuple [value] at [index] to [element]',
    singleline: 'set element {index} in {value} to {element}',
    comments: {
      value: 'The tuple to set an element to',
      index: 'The index of the element',
      element: 'The value of the element',
    },
    returnComments: 'The previous element at [index], or undefined if none exists.',
  });

  registry.addOperation(TupleOps.isValid, {
    name: 'Is Tuple?',
    description: 'Determines whether [value] is a valid value for Tuple',
    singleline: 'is {value} tuple?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is a tuple, otherwise false.',
  });

  registry.addOperation(TupleOps.isEqual, {
    name: 'Tuples Equal?',
    description: 'Determines whether [value] is equal to [test]',
    singleline: '{value} equals {test}',
    comments: {
      value: 'The tuple to evaluate',
      test: 'The test tuple to compare against',
    },
    returnComments: 'True if [value] equals [test], otherwise false',
  });

  registry.addOperation(TupleOps.isNotEqual, {
    name: 'Tuples Not Equal?',
    description: 'Determines whether [value] is not equal to [test]',
    singleline: '{value} not equal to {test}',
    comments: {
      value: 'The tuple to evaluate',
      test: 'The test tuple to compare against',
    },
    returnComments: 'True if [value] is not equal to [test], otherwise false',
  });

  registry.addOperation(TupleOps.isLess, {
    name: 'Is Tuple Less?',
    description: 'Determines whether [value] is less than [test]',
    singleline: '{value} < {test}',
    comments: {
      value: 'The tuple to evaluate',
      test: 'The test tuple to compare against',
    },
    returnComments: 'True if [value] is less than [test], otherwise false.',
  });

  registry.addOperation(TupleOps.isLessOrEqual, {
    name: 'Is Tuple Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test]',
    singleline: '{value} <= {test}',
    comments: {
      value: 'The tuple to evaluate',
      test: 'The test tuple to compare against',
    },
    returnComments: 'True if [value] is less than or equal to [test], otherwise false.',
  });

  registry.addOperation(TupleOps.isGreater, {
    name: 'Is Tuple Greater?',
    description: 'Determines whether [value] is greater than [test]',
    singleline: '{value} > {test}',
    comments: {
      value: 'The tuple to evaluate',
      test: 'The test tuple to compare against',
    },
    returnComments: 'True if [value] is greater than [test], otherwise false.',
  });

  registry.addOperation(TupleOps.isGreaterOrEqual, {
    name: 'Is Tuple Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test]',
    singleline: '{value} >= {test}',
    comments: {
      value: 'The tuple to evaluate',
      test: 'The test tuple to compare against',
    },
    returnComments: 'True if [value] is greater than or equal to [test], otherwise false.',
  });

  registry.addOperation(TupleOps.asAny, {
    name: 'Cast Tuple to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

  registry.addOperation(TupleOps.asBoolean, {
    name: 'Cast Tuple to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first boolean value found in the tuple, otherwise false.',
  });

  registry.addOperation(TupleOps.asList, {
    name: 'Cast Tuple to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first list value found in the tuple, otherwise a list with a single item.',
  });

  registry.addOperation(TupleOps.asDate, {
    name: 'Cast Tuple to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first date value found in the tuple, otherwise false.',
  });

  registry.addOperation(TupleOps.asMap, {
    name: 'Cast Tuple to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first map value found in the tuple, otherwise a map with a single key-value pair of "value" and [value]',
  });

  registry.addOperation(TupleOps.asNumber, {
    name: 'Cast Tuple to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first number value found in the tuple, otherwise false.',
  });

  registry.addOperation(TupleOps.asObject, {
    name: 'Cast Tuple to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first object value found in the tuple, otherwise an object with a single property "value" and [value]',
  });

  registry.addOperation(TupleOps.asText, {
    name: 'Cast Tuple to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first text value found in the tuple, otherwise false.',
  });

  registry.addOperation(TupleOps.asTuple, {
    name: 'Cast Tuple to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

};
