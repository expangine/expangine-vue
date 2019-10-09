import { TextOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(TextOps.create, {
    name: 'Create Text',
    description: 'Create a Text value (empty)',
    singleline: 'empty text',
    comments: {},
  });

  registry.addOperation(TextOps.maybe, {
    name: 'Try Text?',
    description: 'If the [value] is text, return the text value, otherwise return undefined',
    singleline: '{value} to text?',
    comments: {
      value: 'The value to convert to text or undefined',
    },
  });

  registry.addOperation(TextOps.append, {
    name: 'Append Text',
    description: 'Append [append] to [value]',
    singleline: '{value} + {append}',
    comments: {
      value: 'The text to append to',
      append: 'The text to add after [value]',
    },
  });

  registry.addOperation(TextOps.prepend, {
    name: 'Prepend Text',
    description: 'Prepend [prepend] to [value]',
    singleline: '{prepend} + {value}',
    comments: {
      value: 'The text to prepend to',
      prepend: 'The text to add before [value]',
    },
  });

  registry.addOperation(TextOps.lower, {
    name: 'Lowercase',
    description: 'Convert [value] to lowercase',
    singleline: '{value} to lowercase',
    comments: {
      value: 'The value to convert to lowercase',
    },
  });

  registry.addOperation(TextOps.upper, {
    name: 'Uppercase',
    description: 'Convert [value] to uppercase',
    singleline: '{value} to uppercase',
    comments: {
      value: 'The value to convert to uppercase',
    },
  });

  registry.addOperation(TextOps.char, {
    name: 'Character At',
    description: 'Get the character at [index] in [value] and if none exists return [outside]',
    singleline: '{value} char at {index} otherwise {outside}',
    comments: {
      value: 'The text to get the character from',
      index: 'The index of the character in the text',
      outside: 'The text to return if the index is beyond the length of the text',
    },
    defaults: {
      outside: 'empty text',
    },
  });

  registry.addOperation(TextOps.replace, {
    name: 'Replace Text',
    description: 'Replace [find] in [value] with [replace]',
    singleline: 'replace {find} in {value} with {replace}',
    comments: {
      value: 'The text to find and replace in',
      find: 'The text to find and replace',
      replace: 'The replacement text',
    },
  });

  registry.addOperation(TextOps.repeat, {
    name: 'Repeat Text',
    description: 'Repeat text [value] [times] times',
    singleline: 'repeat {value} {times} times',
    comments: {
      value: 'The text to repeat',
      times: 'The number of times to repeat [value]',
    },
  });

  registry.addOperation(TextOps.split, {
    name: 'Split Text',
    description: 'Split [value] [by] optionally a maximum number of [limit] times',
    singleline: 'split {value} by {by} a maximum number of {limit} times',
    comments: {
      value: 'The value to split into an array of text',
      by: 'The text to split around',
      limit: 'The maximum number of splits to do',
    },
    defaults: {
      limit: 'no max',
    },
  });

  registry.addOperation(TextOps.chars, {
    name: 'Text to Characters',
    description: 'Convert [value] into a list of characters',
    singleline: '{value} characters',
    comments: {
      value: 'The value to convert to a character list',
    },
  });

  registry.addOperation(TextOps.sub, {
    name: 'Text Section',
    description: 'Get a section of a [value] from [start] to [end] (exclusive)',
    singleline: 'section of {value} from {start} to {end} (exclusive)',
    comments: {
      value: 'The value to get a section of',
      start: 'The index of the first character in the text',
      end: 'The index in the text right after the last character of the section',
    },
    defaults: {
      start: 'start of [value]',
      end: 'end of [value]',
    },
    keywords: ['substring', 'sub'],
  });

  registry.addOperation(TextOps.indexOf, {
    name: 'Index of Text',
    description: 'Finds the index of [search] in [value] starting at [start]',
    singleline: 'index of {search} in {value} starting at {start}',
    comments: {
      value: 'The text to search through',
      search: 'The text to search for',
      start: 'The index to start searching at (inclusive)',
    },
    defaults: {
      start: 'start of [value]',
    },
  });

  registry.addOperation(TextOps.lastIndexOf, {
    name: 'Last Index of Text',
    description: 'Finds the last index of [search] in [value] starting at [start]',
    singleline: 'last index of {search} in {value} starting at {start}',
    comments: {
      value: 'The text to search through',
      search: 'The text to search for',
      start: 'The index to start searching at (inclusive)',
    },
    defaults: {
      start: 'end of [value]',
    },
  });

  registry.addOperation(TextOps.trim, {
    name: 'Trim Text',
    description: 'Remove the whitespace in [value] at the [start] and [end]',
    singleline: 'trim {value} at start {start} and end {end}',
    comments: {
      value: 'The text to trim',
      start: 'If whitespace should be removed from the start',
      end: 'If whitespace should be removed from the end',
    },
    defaults: {
      start: 'true',
      end: 'true',
    },
  });

  registry.addOperation(TextOps.startsWith, {
    name: 'Text Starts With',
    description: 'Determines if [value] starts with [test]',
    singleline: '{value} starts with {test}?',
    comments: {
      value: 'The text to look at',
      test: 'The text to look for at the start',
    },
  });

  registry.addOperation(TextOps.endsWith, {
    name: 'Text Ends With',
    description: 'Determines if [value] ends with [test]',
    singleline: '{value} ends with {test}?',
    comments: {
      value: 'The text to look at',
      test: 'The text to look for at the end',
    },
  });

  registry.addOperation(TextOps.soundex, {
    name: 'Phonetic Value',
    description: 'Computes the phonetic code of a text [value], also known as soundex. The phonetic code can be used to determine if two words sound similar in English. The closer the code is in characters, the more they sound alike.',
    singleline: 'phonetic code of {value} with minimum length {min} and maximum {max}',
    comments: {
      value: 'The text to compute the phonetic code of',
      max: 'The maximum number of characters to return',
      min: 'The minimum number of characters to return',
    },
    defaults: {
      max: 'no maximum',
      min: '4',
    },
  });

  registry.addOperation(TextOps.distance, {
    name: 'Differences between Text',
    description: 'Calculate the number of changes in characters that would need to be made to change [value] to [test]',
    singleline: 'differences between {value} and {test}',
    comments: {
      value: 'The first text to compare',
      test: 'The second text to compare',
    },
    keywords: ['levenshtein'],
  });

  registry.addOperation(TextOps.length, {
    name: 'Text Length',
    description: 'The number of characters in [value]',
    singleline: '{value} length',
    comments: {
      value: 'The text to return the length of',
    },
  });

  registry.addOperation(TextOps.compare, {
    name: 'Compare Text',
    description: 'Compare [value] and [test] and [ignoreCase]',
    singleline: 'compare {value} to {test} and ignore case {ignoreCase}',
    comments: {
      value: 'The first text to compare',
      test: 'The second text to compare',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    returnComments: 'Return 0 if they are equal, -1 if [value] is after [test], otherwise +1',
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.like, {
    name: 'Like Text',
    description: 'Determines if [value] is like [pattern] using % as a wildcard',
    singleline: '{value} like {pattern} and ignore case {ignoreCase}',
    comments: {
      value: 'The text value to compare to the [pattern]',
      pattern: 'The pattern with % wildcards',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.pad, {
    name: 'Pad Text',
    description: 'Pad [value] with [padding] with a [min] and [max] length, optionally [append]ing the [padding] to the end',
    singleline: 'pad {value} with {padding} to at least {min} characters and no more than {max} characters, optionally appending padding to end {append}',
    comments: {
      value: 'The text value to pad',
      padding: 'The text to pad at the start of [value] or at the end if [append] is true',
      min: 'The minimum number of characters the result should be',
      max: 'The maximum number of characters the result should be, removing characters if necessary from the start or end if [append]',
      append: 'If the padding should go at the end (true) or start (false)',
    },
    defaults: {
      max: 'no max',
      append: 'false',
    },
  });

  registry.addOperation(TextOps.toNumber, {
    name: 'Convert Text to Number',
    description: 'Convert [value] to number, otherwise return [invalidValue]',
    singleline: '{value} to number, if not valid number use {invalidValue}',
    comments: {
      value: 'The text value to convert to a number',
      invalidValue: 'The value to return if a number could not be parsed from the text',
    },
    defaults: {
      invalidValue: '0',
    },
  });

  registry.addOperation(TextOps.isValid, {
    name: 'Is Text?',
    description: 'Determines whether [value] is a valid value for Text',
    singleline: 'is {value} text?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(TextOps.isEmpty, {
    name: 'Is Text Empty?',
    description: 'Determines whether [value] has zero characters',
    singleline: 'is {value} empty?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(TextOps.isNotEmpty, {
    name: 'Is Text Not Empty?',
    description: 'Determines whether [value] has more than zero characters',
    singleline: 'is {value} not empty?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(TextOps.isEqual, {
    name: 'Text Equal?',
    description: 'Determines whether [a] is equal to [b] optionally [ignoreCase]',
    singleline: '{a} equals {b} ignore case {ignoreCase}',
    comments: {
      a: 'The first value to compare',
      b: 'The second value to compare',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.isNotEqual, {
    name: 'Text Not Equal?',
    description: 'Determines whether [a] is not equal to [b] optionally [ignoreCase]',
    singleline: '{a} is not equal to {b} ignore case {ignoreCase}',
    comments: {
      a: 'The first value to compare',
      b: 'The second value to compare',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.isLess, {
    name: 'Is Text Less?',
    description: 'Determines whether [value] is alphabetically less than [test] optionally [ignoreCase]',
    singleline: '{value} < {test} ignore case {ignoreCase}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.isLessOrEqual, {
    name: 'Is Text Less or Equal?',
    description: 'Determines whether [value] is alphabetically less than or equal to [test] optionally [ignoreCase]',
    singleline: '{value} <= {test} ignore case {ignoreCase}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.isGreater, {
    name: 'Is Text Greater?',
    description: 'Determines whether [value] is alphabetically greater than [test] optionally [ignoreCase]',
    singleline: '{value} > {test} ignore case {ignoreCase}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.isGreaterOrEqual, {
    name: 'Is Text Greater or Equal?',
    description: 'Determines whether [value] is alphabetically greater than or equal to [test] optionally [ignoreCase]',
    singleline: '{value} >= {test} ignore case {ignoreCase}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
      ignoreCase: 'Whether case should be ignored when comparing',
    },
    defaults: {
      ignoreCase: 'false',
    },
  });

  registry.addOperation(TextOps.isLower, {
    name: 'Is Text Lowecase?',
    description: 'Determines whether [value] is in lowercase',
    singleline: '{value} is lowercase?',
    comments: {
      value: 'The text to evaluate for lowercase',
    },
  });

  registry.addOperation(TextOps.isUpper, {
    name: 'Is Text Uppercase?',
    description: 'Determines whether [value] is in uppercase',
    singleline: '{value} is uppercase?',
    comments: {
      value: 'The text to evaluate for uppercase',
    },
  });

  registry.addOperation(TextOps.asAny, {
    name: 'Cast Text to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asBoolean, {
    name: 'Cast Text to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asDate, {
    name: 'Cast Text to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asList, {
    name: 'Cast Text to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asMap, {
    name: 'Cast Text to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asNumber, {
    name: 'Cast Text to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asObject, {
    name: 'Cast Text to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asText, {
    name: 'Cast Text to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(TextOps.asTuple, {
    name: 'Cast Text to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
  });

};
