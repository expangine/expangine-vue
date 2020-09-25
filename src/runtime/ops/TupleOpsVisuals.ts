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

  registry.addOperation(TupleOps.build, {
    name: 'Build Tuple',
    description: 'Build a tuple by concatenating tuples/values together into tuple.',
    singleline: 'tuple of {a} {b} {c} {d} {e}',
    comments: {
      a: 'The 1st tuple or value to add to the tuple result',
      b: 'The 2nd tuple or value to add to the tuple result',
      c: 'The 3rd tuple or value to add to the tuple result',
      d: 'The 4th tuple or value to add to the tuple result',
      e: 'The 5th tuple or value to add to the tuple result',
    },
    defaults: {
      c: 'none',
      d: 'none',
      e: 'none',
    },
    returnComments: 'Return a built tuple of [a], [b], [c], [d], and [e] where a tuple has each element in the final tuple and non-tuple types are added as a single element. If any of the parameters are a list the result of the operation will be a list of unknown length and varying types.',
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
    singleline: '{value} is tuple?',
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
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asBoolean, {
    name: 'Cast Tuple to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first boolean value found in the tuple, otherwise false.',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asColor, {
    name: 'Cast Tuple to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first color value found in the tuple, otherwise white.',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asList, {
    name: 'Cast Tuple to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first list value found in the tuple, otherwise a list with a single item.',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asDate, {
    name: 'Cast Tuple to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first date value found in the tuple, otherwise false.',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asMap, {
    name: 'Cast Tuple to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first map value found in the tuple, otherwise a map with a single key-value pair of "value" and [value]',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asNumber, {
    name: 'Cast Tuple to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first number value found in the tuple, otherwise false.',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asObject, {
    name: 'Cast Tuple to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first object value found in the tuple, otherwise an object with a single property "value" and [value]',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asText, {
    name: 'Cast Tuple to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The first text value found in the tuple, otherwise false.',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asTuple, {
    name: 'Cast Tuple to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(TupleOps.asSet, {
    name: 'Cast Tuple to Set',
    description: 'Cast [value] to Set',
    singleline: '{value} as set',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A set with a single [value] value.',
    weight: 0.5,
  });

};
