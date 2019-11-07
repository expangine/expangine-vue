import { TextOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(TextOps.create, {
    name: 'Create Text',
    description: 'Create a Text value (empty)',
    singleline: 'empty text',
    comments: {},
    returnComments: 'An empty text.',
  });

  registry.addOperation(TextOps.maybe, {
    name: 'Try Text?',
    description: 'If the [value] is text, return the text value, otherwise return undefined',
    singleline: '{value} to text?',
    comments: {
      value: 'The value to convert to text or undefined',
    },
    returnComments: 'text or undefined.',
  });

  registry.addOperation(TextOps.append, {
    name: 'Append Text',
    description: 'Append [append] to [value]',
    singleline: '{value} + {append}',
    comments: {
      value: 'The text to append to',
      append: 'The text to add after [value]',
    },
    returnComments: '[value] + [append]',
  });

  registry.addOperation(TextOps.prepend, {
    name: 'Prepend Text',
    description: 'Prepend [prepend] to [value]',
    singleline: '{prepend} + {value}',
    comments: {
      value: 'The text to prepend to',
      prepend: 'The text to add before [value]',
    },
    returnComments: '[prepend] + [value]',
  });

  registry.addOperation(TextOps.lower, {
    name: 'Lowercase',
    description: 'Convert [value] to lowercase',
    singleline: '{value} to lowercase',
    comments: {
      value: 'The value to convert to lowercase',
    },
    returnComments: '[value] in lowercase',
  });

  registry.addOperation(TextOps.upper, {
    name: 'Uppercase',
    description: 'Convert [value] to uppercase',
    singleline: '{value} to uppercase',
    comments: {
      value: 'The value to convert to uppercase',
    },
    returnComments: '[value] in uppercase',
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
    returnComments: 'The character from [value] at [index], otherwise [otherwise].',
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
    returnComments: 'A new text value with [find] replaced with [replace].',
  });

  registry.addOperation(TextOps.repeat, {
    name: 'Repeat Text',
    description: 'Repeat text [value] [times] times',
    singleline: 'repeat {value} {times} times',
    comments: {
      value: 'The text to repeat',
      times: 'The number of times to repeat [value]',
    },
    returnComments: 'A text value with [value] repeated [times] times.',
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
    returnComments: 'A list of text built by splitting [value] by [by] [limit] number of times.',
  });

  registry.addOperation(TextOps.chars, {
    name: 'Text to Characters',
    description: 'Convert [value] into a list of characters',
    singleline: '{value} characters',
    comments: {
      value: 'The value to convert to a character list',
    },
    returnComments: 'A list of the characters in [value].',
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
    returnComments: 'The section of text in [value] from [start] to [end] (exclusive).',
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
    returnComments: 'The index of [search] in [text] starting at [start], otherwise -1.',
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
    returnComments: 'The last index of [search] in [text] starting at [start], otherwise -1.',
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
    returnComments: 'A new text value with whitespace removed.',
  });

  registry.addOperation(TextOps.startsWith, {
    name: 'Text Starts With',
    description: 'Determines if [value] starts with [test]',
    singleline: '{value} starts with {test}?',
    comments: {
      value: 'The text to look at',
      test: 'The text to look for at the start',
    },
    returnComments: 'True if [value] starts with [test], otherwise false.',
  });

  registry.addOperation(TextOps.endsWith, {
    name: 'Text Ends With',
    description: 'Determines if [value] ends with [test]',
    singleline: '{value} ends with {test}?',
    comments: {
      value: 'The text to look at',
      test: 'The text to look for at the end',
    },
    returnComments: 'True if [value] ends with [test], otherwise false.',
  });

  registry.addOperation(TextOps.soundex, {
    name: 'Phonetic Value using Soundex',
    description: 'Computes the phonetic code of a text [value], also known as soundex. The phonetic code can be used to determine if two words sound similar in English. The closer the code is in characters, the more they sound alike.',
    singleline: 'soundex of {value} with minimum length {min} and maximum {max}',
    comments: {
      value: 'The text to compute the phonetic code of',
      max: 'The maximum number of characters to return',
      min: 'The minimum number of characters to return',
    },
    defaults: {
      max: 'no maximum',
      min: '4',
    },
    returnComments: 'The phonetic code of [value] using soundex.',
  });

  registry.addOperation(TextOps.metaphone, {
    name: 'Phonetic Value using Metaphone',
    description: 'Computes the phonetic code of a text [value], also known as metaphone. The phonetic code can be used to determine if two words sound similar in English. The closer the code is in characters, the more they sound alike.',
    singleline: 'metaphone of {value}',
    comments: {
      value: 'The text to compute the phonetic code of',
    },
    returnComments: 'The phonetic code of [value] using metaphone.',
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
    returnComments: 'The number of changes (add/remove) needed to change [value] to [test].',
  });

  registry.addOperation(TextOps.length, {
    name: 'Text Length',
    description: 'The number of characters in [value]',
    singleline: '{value} length',
    comments: {
      value: 'The text to return the length of',
    },
    returnComments: 'The number of characters in [value].',
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
    defaults: {
      ignoreCase: 'false',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] < [test] and a positive number when [value] > [test].',
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
    returnComments: 'True if [value] matches the [pattern].',
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
    returnComments: 'The [value] text padded.',
  });

  registry.addOperation(TextOps.regexTest, {
    name: 'Matches Regular Expression',
    description: 'Determines if [value] matches [regex]',
    singleline: '{value} matches {regex}? ignore case {ignoreCase} multiple lines {multiline}',
    comments: {
      value: 'The text value to test',
      regex: 'The regular expression',
      ignoreCase: 'Whether to ignore case while attempting a match in a string',
      multiline: 'Whether or not to search in strings across multiple lines',
    },
    defaults: {
      ignoreCase: 'false',
      multiline: 'false',
    },
    returnComments: 'True if [value] matches [regex], otherwise false.',
  });

  registry.addOperation(TextOps.regexSplit, {
    name: 'Split Text with Regular Expression',
    description: 'Determines if [value] matches [regex]',
    singleline: 'split {value} with {regex} limit {limit} ignore case {ignoreCase} multiple lines {multiline}',
    comments: {
      value: 'The text value to split',
      regex: 'The regular expression to split by',
      limit: 'This maximum number of splits to do',
      ignoreCase: 'Whether to ignore case while attempting a match in a string',
      multiline: 'Whether or not to search in strings across multiple lines',
    },
    defaults: {
      limit: 'none',
      ignoreCase: 'false',
      multiline: 'false',
    },
    returnComments: 'A list of text built by splitting [value] by [regex].',
  });

  registry.addOperation(TextOps.regexMatch, {
    name: 'Get Regular Expression Matches',
    description: 'Get a list of the matches in [value] to a [regex]',
    singleline: 'matches of {regex} in {value} ignore case {ignoreCase} multiple lines {multiline}',
    comments: {
      value: 'The text value to find matches in',
      regex: 'The regular expression to search with',
      ignoreCase: 'Whether to ignore case while attempting a match in a string',
      multiline: 'Whether or not to search in strings across multiple lines',
    },
    defaults: {
      ignoreCase: 'false',
      multiline: 'false',
    },
    returnComments: 'A list of text with each match in [value] with [regex]',
  });

  registry.addOperation(TextOps.regexMatchAll, {
    name: 'Get Regular Expression Match Groups',
    description: 'Get a list of the match groups in [value] to a [regex]',
    singleline: 'match groups of {regex} in {value} ignore case {ignoreCase} multiple lines {multiline}',
    comments: {
      value: 'The text value to find matches in',
      regex: 'The regular expression to search with',
      ignoreCase: 'Whether to ignore case while attempting a match in a string',
      multiline: 'Whether or not to search in strings across multiple lines',
    },
    defaults: {
      ignoreCase: 'false',
      multiline: 'false',
    },
    returnComments: 'A list of match objects for each match in [value] with [regex]',
  });

  registry.addOperation(TextOps.regexReplace, {
    name: 'Replace Text using Regular Expression',
    description: 'Replace occurrences of [regex] with [replacement] in [value]',
    singleline: '{value} replace {regex} with {replacement} all occurrences {all} ignore case {ignoreCase} multiple lines {multiline}',
    comments: {
      value: 'The text value replace parts of',
      regex: 'The regular expression to replace with',
      replacement: 'The text to replace for all matches. If groups are using the the regular expression you can refer to them with $1, $2, and so on.',
      all: 'Replace all occurrences in the value',
      ignoreCase: 'Whether to ignore case while attempting a match in a string',
      multiline: 'Whether or not to search in strings across multiple lines',
    },
    defaults: {
      all: 'false',
      ignoreCase: 'false',
      multiline: 'false',
    },
    returnComments: 'The text [value] with all [replacement]s requested.',
  });

  registry.addOperation(TextOps.regexReplaceDynamic, {
    name: 'Replace Text Dynamically using Regular Expression',
    description: 'Replace occurrences in [value] of [regex] calling [replace] for each match',
    singleline: '{value} replace {regex} using {replace} all occurrences {all} ignore case {ignoreCase} multiple lines {multiline}',
    comments: {
      value: 'The text value replace parts of',
      regex: 'The regular expression to replace with',
      replace: 'The text to replace for the current match',
      all: 'Replace all occurrences in the value',
      ignoreCase: 'Whether to ignore case while attempting a match in a string',
      multiline: 'Whether or not to search in strings across multiple lines',
    },
    scopeComments: {
      match: 'The current match being replaced',
    },
    defaults: {
      all: 'false',
      ignoreCase: 'false',
      multiline: 'false',
    },
    returnComments: 'The text [value] with all [replace]s requested.',
  });

  registry.addOperation(TextOps.regexIndexOf, {
    name: 'Index of Text using Regular Expression',
    description: 'Finds the index of [regex] in [value]',
    singleline: 'index of {regex} in {value} ignore case {ignoreCase} multiple lines {multiline}',
    comments: {
      value: 'The text value to search through',
      regex: 'The regular expression to search with',
      ignoreCase: 'Whether to ignore case while attempting a match in a string',
      multiline: 'Whether or not to search in strings across multiple lines',
    },
    defaults: {
      ignoreCase: 'false',
      multiline: 'false',
    },
    returnComments: 'The index of [regex] in [value] or -1 if the expression was not found.',
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
    returnComments: 'The number parsed from the text [value], otherwise [invalidValue].',
  });

  registry.addOperation(TextOps.isValid, {
    name: 'Is Text?',
    description: 'Determines whether [value] is a valid value for Text',
    singleline: 'is {value} text?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is text, otherwise false.',
  });

  registry.addOperation(TextOps.isEmpty, {
    name: 'Is Text Empty?',
    description: 'Determines whether [value] has zero characters',
    singleline: 'is {value} empty?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is empty text, otherwise false.',
  });

  registry.addOperation(TextOps.isNotEmpty, {
    name: 'Is Text Not Empty?',
    description: 'Determines whether [value] has more than zero characters',
    singleline: 'is {value} not empty?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is not empty text, otherwise false.',
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
    returnComments: 'True if [a] equals [b], otherwise false',
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
    returnComments: 'True if [a] is not equal to [b], otherwise false',
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
    returnComments: 'True if [value] is less than [test], otherwise false.',
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
    returnComments: 'True if [value] is less than or equal to [test], otherwise false.',
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
    returnComments: 'True if [value] is greater than [test], otherwise false.',
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
    returnComments: 'True if [value] is greater than or equal to [test], otherwise false.',
  });

  registry.addOperation(TextOps.isLower, {
    name: 'Is Text Lowecase?',
    description: 'Determines whether [value] is in lowercase',
    singleline: '{value} is lowercase?',
    comments: {
      value: 'The text to evaluate for lowercase',
    },
    returnComments: 'True if [value] is in all lowercase, otherwise false.',
  });

  registry.addOperation(TextOps.isUpper, {
    name: 'Is Text Uppercase?',
    description: 'Determines whether [value] is in uppercase',
    singleline: '{value} is uppercase?',
    comments: {
      value: 'The text to evaluate for uppercase',
    },
    returnComments: 'True if [value] is in all uppercase, otherwise false.',
  });

  registry.addOperation(TextOps.asAny, {
    name: 'Cast Text to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

  registry.addOperation(TextOps.asBoolean, {
    name: 'Cast Text to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'True if text looks like true, t, 1, y, or x, otherwise false.',
  });

  registry.addOperation(TextOps.asColor, {
    name: 'Cast Text to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A color parsed from the text, otherwise white.',
  });

  registry.addOperation(TextOps.asDate, {
    name: 'Cast Text to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A date parsed from the text, otherwise the current date & time.',
  });

  registry.addOperation(TextOps.asList, {
    name: 'Cast Text to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The [value] converted to a list by returning it as a list with a single item.',
  });

  registry.addOperation(TextOps.asMap, {
    name: 'Cast Text to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A map with a single key-value pair of "value" and [value]',
  });

  registry.addOperation(TextOps.asNumber, {
    name: 'Cast Text to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A number parsed from text, if none could be 0.',
  });

  registry.addOperation(TextOps.asObject, {
    name: 'Cast Text to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'An object with a single property "value" and [value]',
  });

  registry.addOperation(TextOps.asText, {
    name: 'Cast Text to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
  });

  registry.addOperation(TextOps.asTuple, {
    name: 'Cast Text to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A tuple with a single [value] element.',
  });

};
