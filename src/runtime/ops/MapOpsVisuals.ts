import { MapOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(MapOps.create, {
    name: 'Create Map',
    description: 'Create a Map value (empty)',
    singleline: 'create map',
    comments: {},
    returnComments: 'A new empty Map',
  });

  registry.addOperation(MapOps.maybe, {
    name: 'Try Map?',
    description: 'If the [value] is map, return the map value, otherwise return undefined',
    singleline: '{value} to map?',
    comments: {
      value: 'The value to convert to map or undefined',
    },
    returnComments: 'map or undefined',
  });

  registry.addOperation(MapOps.get, {
    name: 'Get Value',
    description: 'Get a value from [map] with key [key]',
    singleline: 'get {map} [ {key} ]',
    comments: {
      map: 'The map to get an item from',
      key: 'The key of the value in the map',
    },
    returnComments: 'The value with the [key], undefined if none exists.',
  });

  registry.addOperation(MapOps.set, {
    name: 'Set Value',
    description: 'Set a [value] in [map] with key [key] ',
    singleline: 'set {map} [ {key} ] = {value}',
    comments: {
      map: 'The map to set a value to',
      key: 'The key of the value in the map',
      value: 'The value to set in the map at the given key',
    },
    scopeComments: {
      existingValue: 'The existing value in the map',
    },
    returnComments: 'The existing value with the [key], otherwise undefined.',
  });

  registry.addOperation(MapOps.has, {
    name: 'Has Key',
    description: 'Check if a [map] has a [key]',
    singleline: '{map} has {key}',
    comments: {
      map: 'The map to check for a key',
      key: 'The key to look for',
    },
    returnComments: 'True if the [map] has the [key], otherwise false.',
  });

  registry.addOperation(MapOps.delete, {
    name: 'Delete Key',
    description: 'Delete the value in a [map] that has the [key]',
    singleline: 'delete {key} from {map}',
    comments: {
      map: 'The map to remove a key/value from',
      key: 'The key of the key/value pair to remove',
    },
    returnComments: 'True if the [key] was removed, otherwise false.',
  });

  registry.addOperation(MapOps.keys, {
    name: 'Get Keys',
    description: 'Get keys list from [map]',
    singleline: '{map} keys',
    comments: {
      map: 'The map to get the keys of',
    },
    returnComments: 'A list of all the keys in the map.',
  });

  registry.addOperation(MapOps.values, {
    name: 'Get Values',
    description: 'Get values list from [map]',
    singleline: '{map} values',
    comments: {
      map: 'The map to get the values of',
    },
    returnComments: 'A list of all the values in the map.',
  });

  registry.addOperation(MapOps.entries, {
    name: 'Get Entries',
    description: 'Get entries from [map] as an object with key and value lists',
    singleline: '{map} entries',
    comments: {
      map: 'The map to get the entries of',
    },
    returnComments: 'An object with "keys" and "values" lists.',
  });

  registry.addOperation(MapOps.pairs, {
    name: 'Get Key/Value Pairs',
    description: 'Get key/value pairs from [map] as a list of objects with key and value properties',
    singleline: '{map} pairs',
    comments: {
      map: 'The map to get the key/value pairs of',
    },
    returnComments: 'An array with [key, value] tuples.',
  });

  registry.addOperation(MapOps.clear, {
    name: 'Clear Map',
    description: 'Clear [map]',
    singleline: 'clear {map}',
    comments: {
      map: 'The map to remove all keys/values from',
    },
    returnComments: '[map]',
  });

  registry.addOperation(MapOps.count, {
    name: 'Map Size',
    description: 'Number of key/value pairs in [map]',
    singleline: '{map} size',
    comments: {
      map: 'The map to count the key/values of',
    },
    returnComments: 'The number of key-value pairs in the map.',
  });

  registry.addOperation(MapOps.cmp, {
    name: 'Compare Maps',
    description: 'Compares maps [value] and [test] using [compare]',
    singleline: 'compare {value} and {test} using {compare}',
    comments: {
      value: 'The first map to compare',
      test: 'The second map to compare',
      compare: 'The expression that compares two values',
    },
    scopeComments: {
      key: 'The key of the values being compared',
      value: 'The first value to compare',
      test: 'The second value to compare',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] < [test] and a positive number when [value] > [test].',
  });

  registry.addOperation(MapOps.copy, {
    name: 'Copy Map',
    description: 'Copy [map] optionally doing a [deepCopy] of each value in the map and [deepCopyKey] of each matching key',
    singleline: 'copy {map} and deep copy the values with {deepCopy} and keys with {deepCopyKey}',
    comments: {
      map: 'The map to copy',
      deepCopy: 'The expression which copies the current value',
      deepCopyKey: 'The expression which copies the current key',
    },
    scopeComments: {
      map: 'The map to copy',
      key: 'The current key to copy',
      value: 'The current value to copy',
    },
    defaults: {
      deepCopy: 'same value',
      deepCopyKey: 'same key',
    },
    returnComments: 'A new map with all key value copies.',
  });

  registry.addOperation(MapOps.map, {
    name: 'Transform Map',
    description: 'Transform [map] values with [transform] and/or the keys with [transformKey]',
    singleline: 'transform {map} values with {transform} and keys with {transformKey}',
    comments: {
      map: 'The map to †ransform',
      transform: 'The expression which transforms a value',
      transformKey: 'The expression which transforms a key',
    },
    scopeComments: {
      map: 'The map being transformed',
      key: 'The current key of the key/value pair being transformed',
      value: 'The current value of the key/value pair being transformed',
    },
    defaults: {
      transform: 'no transform',
      transformKey: 'no transform',
    },
    returnComments: 'A new map with transformed values and optionally keys.',
  });

  registry.addOperation(MapOps.toPlainObject, {
    name: 'Map to Object',
    description: 'Convert [map] to plain object',
    singleline: '{map} as object',
    comments: {
      map: 'The map to convert to an object',
    },
    returnComments: 'An object with a property for each key in the map.',
  });

  registry.addOperation(MapOps.isValid, {
    name: 'Is Map?',
    description: 'Determines whether [value] is a valid value for Map',
    singleline: 'is {value} map?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is a map, otherwise false.',
  });

  registry.addOperation(MapOps.isEqual, {
    name: 'Maps Equal?',
    description: 'Determines whether [value] is equal to [test] using [isEqual] to compare values',
    singleline: '{value} equals {test} where values are equal when {isEqual}',
    comments: {
      value: 'The map to evaluate',
      test: 'The test map to compare against',
      isEqual: 'Compares two values for equality',
    },
    scopeComments: {
      key: 'The key of the current values being compared',
      value: 'The first value being compared',
      test: 'The second value being compared',
    },
    returnComments: 'True if [value] equals [test], otherwise false',
  });

  registry.addOperation(MapOps.isNotEqual, {
    name: 'Maps Not Equal?',
    description: 'Determines whether [value] is not equal to [test] using [isEqual] to compare values',
    singleline: '{value} not equal to {test} where values are equal when {isEqual}',
    comments: {
      value: 'The map to evaluate',
      test: 'The test map to compare against',
      isEqual: 'Compares two values for equality',
    },
    scopeComments: {
      key: 'The key of the current values being compared',
      value: 'The first value being compared',
      test: 'The second value being compared',
    },
    returnComments: 'True if [value] is not equal to [test], otherwise false',
  });

  registry.addOperation(MapOps.isLess, {
    name: 'Is Map Less?',
    description: 'Determines whether [value] is less than [test] using [compare] to compare values',
    singleline: '{value} < {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two values',
    },
    scopeComments: {
      key: 'The key of the current values being compared',
      value: 'The first value being compared',
      test: 'The second value being compared',
    },
    returnComments: 'True if [value] is less than [test], otherwise false.',
  });

  registry.addOperation(MapOps.isLessOrEqual, {
    name: 'Is Map Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test] using [compare] to compare values',
    singleline: '{value} <= {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two values',
    },
    scopeComments: {
      key: 'The key of the current values being compared',
      value: 'The first value being compared',
      test: 'The second value being compared',
    },
    returnComments: 'True if [value] is less than or equal to [test], otherwise false.',
  });

  registry.addOperation(MapOps.isGreater, {
    name: 'Is Map Greater?',
    description: 'Determines whether [value] is greater than [test] using [compare] to compare values',
    singleline: '{value} > {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two values',
    },
    scopeComments: {
      key: 'The key of the current values being compared',
      value: 'The first value being compared',
      test: 'The second value being compared',
    },
    returnComments: 'True if [value] is greater than [test], otherwise false.',
  });

  registry.addOperation(MapOps.isGreaterOrEqual, {
    name: 'Is Map Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test] using [compare] to compare values',
    singleline: '{value} >= {test} using {compare}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      compare: 'Compares two values',
    },
    scopeComments: {
      key: 'The key of the current values being compared',
      value: 'The first value being compared',
      test: 'The second value being compared',
    },
    returnComments: 'True if [value] is greater than or equal to [test], otherwise false.',
  });


  registry.addOperation(MapOps.asAny, {
    name: 'Cast Map to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

  registry.addOperation(MapOps.asBoolean, {
    name: 'Cast Map to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the map contains a boolean value with key "value" it is returned, otherwise true is returned if the map is not empty and false if the map is empty.',
  });

  registry.addOperation(MapOps.asColor, {
    name: 'Cast Map to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the map contains a color value with key "value" it is returned, otherwise white.',
  });

  registry.addOperation(MapOps.asList, {
    name: 'Cast Map to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The list of values from the map.',
  });

  registry.addOperation(MapOps.asDate, {
    name: 'Cast Map to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the map contains a date value with key "value" it is returned, otherwise the current date & time.',
  });

  registry.addOperation(MapOps.asMap, {
    name: 'Cast Map to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

  registry.addOperation(MapOps.asNumber, {
    name: 'Cast Map to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the map contains a number value with key "value" it is returned, otherwise the size of the map.',
  });

  registry.addOperation(MapOps.asObject, {
    name: 'Cast Map to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the map contains an object value with key "value" it is returned, otherwise an object with a single property "value" and [value].',
  });

  registry.addOperation(MapOps.asText, {
    name: 'Cast Map to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the map contains a text value with key "value" it is returned, otherwise an empty text.',
  });

  registry.addOperation(MapOps.asTuple, {
    name: 'Cast Map to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'If the map contains a tuple value with key "value" it is returned, otherwise a tuple with a single [value] element.',
  });

};
