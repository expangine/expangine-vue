import { SetOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(SetOps.create, {
    name: 'Create Set',
    description: 'Create a Set value (empty)',
    singleline: 'create set',
    comments: {},
    returnComments: 'A new empty Set',
  });

  registry.addOperation(SetOps.createLike, {
    name: 'Create Set Like',
    description: 'Create an empty Set with the same values as another [set]',
    singleline: 'create set like {set}',
    comments: {
      set: 'The set which has values that this set will have',
    },
    returnComments: 'A new empty Set',
  });

  registry.addOperation(SetOps.createFor, {
    name: 'Create Set For',
    description: 'Create an empty Set for [value]s with a given type',
    singleline: 'create set for {value}',
    comments: {
      value: 'The values which this set will have',
    },
    returnComments: 'A new empty Set',
  });

  registry.addOperation(SetOps.maybe, {
    name: 'Try Set?',
    description: 'If the [value] is set, return the set value, otherwise return undefined',
    singleline: '{value} to set?',
    comments: {
      value: 'The value to convert to set or undefined',
    },
    returnComments: 'set or undefined',
  });

  registry.addOperation(SetOps.add, {
    name: 'Add Value',
    description: 'Add a [value] to [set]',
    singleline: 'add {value} to  {set}',
    comments: {
      set: 'The set to add a value to',
      value: 'The value to add to the set',
    },
    returnComments: '[set]',
  });

  registry.addOperation(SetOps.has, {
    name: 'Has Value',
    description: 'Check if a [set] has a [value]',
    singleline: '{set} has {value}',
    comments: {
      set: 'The set to check for a value',
      value: 'The value to look for',
    },
    returnComments: 'True if the [set] has the [value], otherwise false.',
  });

  registry.addOperation(SetOps.delete, {
    name: 'Delete Value',
    description: 'Delete the value in a [set]',
    singleline: 'delete {value} from {set}',
    comments: {
      set: 'The set to remove a value from',
      value: 'The value to remove',
    },
    returnComments: 'True if the [value] was removed, otherwise false.',
  });

  registry.addOperation(SetOps.values, {
    name: 'Get Set Values',
    description: 'Get values list from [set]',
    singleline: '{set} values',
    comments: {
      set: 'The set to get the values of',
    },
    returnComments: 'A list of all the values in the set.',
  });

  registry.addOperation(SetOps.clear, {
    name: 'Clear Set',
    description: 'Clear [set]',
    singleline: 'clear {set}',
    comments: {
      set: 'The set to remove all values from',
    },
    returnComments: '[set]',
  });

  registry.addOperation(SetOps.count, {
    name: 'Set Size',
    description: 'Number of values in [set]',
    singleline: '{set} size',
    comments: {
      set: 'The set to count the values of',
    },
    returnComments: 'The number of values in the set.',
  });

  registry.addOperation(SetOps.cmp, {
    name: 'Compare Sets',
    description: 'Compares sets [value] and [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The first set to compare',
      test: 'The second set to compare',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] < [test] and a positive number when [value] > [test].',
  });

  registry.addOperation(SetOps.copy, {
    name: 'Copy Set',
    description: 'Copy [set] optionally doing a [deepCopy] of each value in the set',
    singleline: 'copy {set} and deep copy the values with {deepCopy}',
    comments: {
      set: 'The set to copy',
      deepCopy: 'The expression which copies the current value',
    },
    scopeComments: {
      set: 'The set to copy',
      value: 'The current value to copy',
    },
    defaults: {
      deepCopy: 'same value',
    },
    returnComments: 'A new set with all value copies.',
  });

  registry.addOperation(SetOps.map, {
    name: 'Transform Set',
    description: 'Transform [set] values with [transform]',
    singleline: 'transform {set} values with {transform}',
    comments: {
      set: 'The set to †ransform',
      transform: 'The expression which transforms a value',
    },
    scopeComments: {
      set: 'The set being transformed',
      value: 'The current value being transformed',
    },
    defaults: {
      transform: 'no transform',
    },
    returnComments: 'A new set with transformed values.',
  });

  registry.addOperation(SetOps.isValid, {
    name: 'Is Set?',
    description: 'Determines whether [value] is a valid value for Set',
    singleline: '{value} is set?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is a set, otherwise false.',
  });

  registry.addOperation(SetOps.isEqual, {
    name: 'Sets Equal?',
    description: 'Determines whether [value] is equal to [test]',
    singleline: '{value} equals {test}',
    comments: {
      value: 'The set to evaluate',
      test: 'The test set to compare against',
    },
    returnComments: 'True if [value] equals [test], otherwise false',
  });

  registry.addOperation(SetOps.isNotEqual, {
    name: 'Sets Not Equal?',
    description: 'Determines whether [value] is not equal to [test]',
    singleline: '{value} not equal to {test}',
    comments: {
      value: 'The set to evaluate',
      test: 'The test set to compare against',
    },
    returnComments: 'True if [value] is not equal to [test], otherwise false',
  });

  registry.addOperation(SetOps.isLess, {
    name: 'Is Set Less?',
    description: 'Determines whether [value] is less than [test]',
    singleline: '{value} < {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
    returnComments: 'True if [value] is less than [test], otherwise false.',
  });

  registry.addOperation(SetOps.isLessOrEqual, {
    name: 'Is Set Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test]',
    singleline: '{value} <= {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
    returnComments: 'True if [value] is less than or equal to [test], otherwise false.',
  });

  registry.addOperation(SetOps.isGreater, {
    name: 'Is Set Greater?',
    description: 'Determines whether [value] is greater than [test]',
    singleline: '{value} > {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
    returnComments: 'True if [value] is greater than [test], otherwise false.',
  });

  registry.addOperation(SetOps.isGreaterOrEqual, {
    name: 'Is Set Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test]',
    singleline: '{value} >= {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
    returnComments: 'True if [value] is greater than or equal to [test], otherwise false.',
  });


  registry.addOperation(SetOps.asAny, {
    name: 'Cast Set to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asBoolean, {
    name: 'Cast Set to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the set contains a boolean value it is returned, otherwise true is returned if the set is not empty and false if the set is empty.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asColor, {
    name: 'Cast Set to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the set contains a color value it is returned, otherwise white.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asList, {
    name: 'Cast Set to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The list of values from the set.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asDate, {
    name: 'Cast Set to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the set contains a date it is returned, otherwise the current date & time.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asMap, {
    name: 'Cast Set to Map',
    description: 'Cast [value] to Set',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A map of entries from the set where the key and value are the values from the set.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asNumber, {
    name: 'Cast Set to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the set contains a number value it is returned, otherwise the size of the map.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asObject, {
    name: 'Cast Set to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the set contains an object it is returned, otherwise an object with a single property "value" and [value].',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asText, {
    name: 'Cast Set to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the set contains a text value it is returned, otherwise an empty text.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asTuple, {
    name: 'Cast Set to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the set contains a tuple value it is returned, otherwise a tuple with a single [value] element.',
    weight: 0.5,
  });

  registry.addOperation(SetOps.asSet, {
    name: 'Cast Set to Set',
    description: 'Cast [value] to Set',
    singleline: '{value} as set',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

};
