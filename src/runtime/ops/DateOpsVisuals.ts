import { DateOps } from 'expangine-runtime';
import { Registry } from '../Registry';
import { ifExpr } from './helpers';


export default (registry: Registry) =>
{

  registry.addOperation(DateOps.create, {
    name: 'Create Date',
    description: 'Create a Date value (now)',
    singleline: 'now',
    comments: {},
    returnComments: 'now',
  });

  registry.addOperation(DateOps.maybe, {
    name: 'Try Date?',
    description: 'If the [value] is date, return the date value, otherwise return undefined',
    singleline: '{value} to date?',
    comments: {
      value: 'The value to convert to date or undefined',
    },
    returnComments: 'Date or undefined',
  });

  registry.addOperation(DateOps.now, {
    name: 'Now',
    description: 'Date value of now',
    singleline: 'now',
    comments: {},
    returnComments: 'A date with the current day and time',
  });

  registry.addOperation(DateOps.today, {
    name: 'Today',
    description: 'Date value of today (start of day)',
    singleline: 'today',
    comments: {},
    returnComments: 'A date with the current day at the start of the day',
  });

  registry.addOperation(DateOps.tomorrow, {
    name: 'Tomorrow',
    description: 'Date value of tomorrow (start of day)',
    singleline: 'tomorrow',
    comments: {},
    returnComments: 'A date with the next day at the start of the day',
  });

  registry.addOperation(DateOps.yesterday, {
    name: 'Yesterday',
    description: 'Date value of yesterday (start of day)',
    singleline: 'yesterday',
    comments: {},
    returnComments: 'A date with the previous day at the start of the day',
  });

  registry.addOperation(DateOps.parse, {
    name: 'Parse Date',
    description: 'Parse a date from one of many acceptable [value] types',
    singleline: 'parse {value} as date as UTC {parseAsUTC}',
    singlelineReadonly: (params) => 'parse {value} as date' + 
      ifExpr(params.parseAsUTC, ' as UTC {parseAsUTC}'),
    comments: {
      value: 'The value to parse',
      parseAsUTC: 'If a text value should be parsed as a UTC timestamp',
    },
    defaults: {
      parseAsUTC: 'false',
    },
    returnComments: 'The date parsed if any, otherwise the current date & time.',
  });

  registry.addOperation(DateOps.fromText, {
    name: 'Date from Text',
    description: 'Parse a date from [value]',
    singleline: 'parse text {value} as date as UTC {parseAsUTC}',
    singlelineReadonly: (params) => 'parse text {value} as date' + 
      ifExpr(params.parseAsUTC, ' as UTC {parseAsUTC}'),
    comments: {
      value: 'The value to parse',
      parseAsUTC: 'If a text value should be parsed as a UTC timestamp',
    },
    defaults: {
      parseAsUTC: 'false',
    },
    returnComments: 'The date parsed if any, otherwise the current date & time.',
  });

  registry.addOperation(DateOps.fromTimestamp, {
    name: 'Date from Timestamp',
    description: 'Parse a date from [value] (milliseconds since Unix Epoch)',
    singleline: 'convert {value} milliseconds to date',
    comments: {
      value: 'The value to parse',
    },
    returnComments: 'The date with the given millisecond timestamp.',
  });

  registry.addOperation(DateOps.fromTimestampSeconds, {
    name: 'Date from Seconds Timestamp',
    description: 'Parse a date from [value] (seconds since Unix Epoch)',
    singleline: 'convert {value} seconds to date',
    comments: {
      value: 'The value to parse',
    },
    returnComments: 'The date with the given seconds timestamp.',
  });

  registry.addOperation(DateOps.min, {
    name: 'Min Date',
    description: 'Return the min of [value] and [test]',
    singleline: 'min( {value} {test} )',
    comments: {
      value: 'The first date',
      test: 'The second date',
    },
    returnComments: 'The lesser of the two dates',
  });

  registry.addOperation(DateOps.max, {
    name: 'Max Date',
    description: 'Return the max of [value] and [test]',
    singleline: 'max( {value} {test} )',
    comments: {
      value: 'The first date',
      test: 'The second date',
    },
    returnComments: 'The greater of the two dates',
  });

  registry.addOperation(DateOps.get, {
    name: 'Get Date Property',
    description: 'Get [property] of [value]',
    singleline: '{property} of {value}',
    comments: {
      value: 'The date value',
      property: 'The property to get',
    },
    returnComments: 'A number value for the given [property].',
  });

  registry.addOperation(DateOps.set, {
    name: 'Set Date Property',
    description: 'Set [property] of [value] to [set]',
    singleline: 'set {property} of {value} to {set}',
    comments: {
      value: 'The date value',
      property: 'The property to set',
      set: 'The new value for the property',
    },
    returnComments: 'Nothing',
  });

  registry.addOperation(DateOps.add, {
    name: 'Add Unit of Time to Date',
    description: 'Add [amount] [unit] to [value]',
    singleline: '{value} + {amount} {unit}',
    comments: {
      value: 'The date value',
      amount: 'The amount of units to add',
      unit: 'The unit of time to add',
    },
    defaults: {
      amount: '1',
    },
    returnComments: 'The [value] with [amount] [unit] added to it.',
  });

  registry.addOperation(DateOps.sub, {
    name: 'Subtract Unit of Time to Date',
    description: 'Subtract [amount] [unit] from [value]',
    singleline: '{value} - {amount} {unit}',
    comments: {
      value: 'The date value',
      amount: 'The amount of units to subtract',
      unit: 'The unit of time to subtract',
    },
    defaults: {
      amount: '1',
    },
    returnComments: 'The [value] with [amount] [unit] subtracted from it.',
  });

  registry.addOperation(DateOps.startOf, {
    name: 'Change Date to start of Unit of Time',
    description: 'Change [value] to start of [unit]',
    singleline: 'set {value} to start of {unit}',
    comments: {
      value: 'The date value',
      unit: 'The unit of time',
    },
    returnComments: 'The [value] moved to the start of [unit].',
  });

  registry.addOperation(DateOps.endOf, {
    name: 'Change Date to end of Unit of Time',
    description: 'Change [value] to end of [unit] [inclusive]',
    singleline: 'set {value} to end of {unit} inclusively? {inclusive}',
    singlelineReadonly: (params) => 'set {value} to end of {unit}' + 
      ifExpr(params.inclusive, ' inclusively? {inclusive}', ' (exclusive)'),
    comments: {
      value: 'The date value',
      unit: 'The unit of time',
      inclusive: 'If the result should be exactly on the date (true), or a millisecond before (false)',
    },
    defaults: {
      inclusive: 'false',
    },
    returnComments: 'The [value] moved to the end of [unit].',
  });

  registry.addOperation(DateOps.daysInMonth, {
    name: 'Days In Month',
    description: 'Number of days in month for [value]',
    singleline: '{value} days in month',
    comments: {
      value: 'The date value',
    },
    returnComments: 'The number of days in the month with the date [value].',
  });

  registry.addOperation(DateOps.daysInYear, {
    name: 'Days In Year',
    description: 'Number of days in year for [value]',
    singleline: '{value} days in year',
    comments: {
      value: 'The date value',
    },
    returnComments: 'The number of days in the year with the date [value].',
  });

  registry.addOperation(DateOps.weeksInYear, {
    name: 'Weeks In Year',
    description: 'Number of weeks in year for [value]',
    singleline: '{value} weeks in year',
    comments: {
      value: 'The date value',
    },
    returnComments: 'The number of weeks in the year with the date [value].',
  });

  registry.addOperation(DateOps.copy, {
    name: 'Copy Date',
    description: 'Copy [value]',
    singleline: 'copy {value}',
    comments: {
      value: 'The date to copy',
    },
    returnComments: 'Return a new date at the same date & time as [value]',
  });

  registry.addOperation(DateOps.cmp, {
    name: 'Compare Date',
    description: 'Compare [value] and [test] to the [unit] and return a number result',
    singleline: 'compare {value} and {test} to the {unit}',
    comments: {
      value: 'The value to compare',
      test: 'The test value to compare against',
      unit: 'A unit to compare against',
    },
    defaults: {
      unit: 'millisecond',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] < [test] and a positive number when [value] > [test].',
  });

  registry.addOperation(DateOps.diff, {
    name: 'Difference between Dates',
    description: 'Difference in [unit] between [value] and [test], absolute value [absolute], and adjust [adjust]',
    singleline: 'difference in {unit} between {value} and {test} absolute value {absolute} and adjusted with {adjust}',
    singlelineReadonly: (params) => 'difference in {unit} between {value} and {test}' + 
      ifExpr(params.absolute, ' absolute value {absolute}') + 
      ifExpr(params.adjust, ' and adjusted with {adjust}'),
    comments: {
      value: 'The value to compare',
      test: 'The test value to compare against',
      unit: 'A unit to use for calculating a difference',
      absolute: 'If the difference should always positive',
      adjust: 'The function to use to adjust the final value',
    },
    defaults: {
      unit: 'millisecond',
      absolute: 'true',
      adjust: 'down',
    },
    returnComments: 'The difference in [unit] between the two dates [value] and [test].',
  });

  registry.addOperation(DateOps.timezoneOffset, {
    name: 'TimeZone Offset',
    description: 'TimeZone offset of [value]',
    singleline: 'timezone offset of {value}',
    comments: {
      value: 'The date value',
    },
    returnComments: 'The timezone offset of [value] in minutes.',
  });

  registry.addOperation(DateOps.toText, {
    name: 'Format Date as Text',
    description: 'Formats [value] as Text using the format [format]',
    singleline: 'format {value} in {format}',
    comments: {
      value: 'The date value',
      format: 'The format of the text',
    },
    returnComments: 'Text with the formatted [value].',
  });

  registry.addOperation(DateOps.toISOText, {
    name: 'Format Date as Text (ISO)',
    description: 'Formats [value] as Text using ISO format',
    singleline: 'format {value} in ISO',
    comments: {
      value: 'The date value',
    },
    returnComments: 'Text with [value] in the ISO format "YYYY-MM-DDTHH:mm:ss.SSSZ".',
  });

  registry.addOperation(DateOps.isValid, {
    name: 'Is Boolean?',
    description: 'Determines whether [value] is a valid value for Boolean',
    singleline: '{value} is boolean?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is a date, otherwise false.',
  });

  registry.addOperation(DateOps.isEqual, {
    name: 'Dates Equal?',
    description: 'Determines whether [value] is equal to [test] with the same unit of time [unit]',
    singleline: '{value} equals {test} in the same {unit}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      unit: 'The unit of time to use to compare the two dates',
    },
    defaults: {
      unit: 'milliseconds',
    },
    returnComments: 'True if [value] and [test] exist in the same [unit], otherwise false',
  });

  registry.addOperation(DateOps.isBefore, {
    name: 'Is Date Before?',
    description: 'Determines whether [value] is before [test] with the same unit of time [unit]',
    singleline: '{value} is before {test} in the same {unit}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      unit: 'The unit of time to use to compare the two dates',
    },
    defaults: {
      unit: 'milliseconds',
    },
    returnComments: 'True if [value] is before [test], otherwise false',
  });

  registry.addOperation(DateOps.isBeforeOrEqual, {
    name: 'Is Date Before or On?',
    description: 'Determines whether [value] is before or on [test] with the same unit of time [unit]',
    singleline: '{value} is before or on {test} in the same {unit}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      unit: 'The unit of time to use to compare the two dates',
    },
    defaults: {
      unit: 'milliseconds',
    },
    returnComments: 'True if [value] is before or equal to [test], otherwise false.',
  });

  registry.addOperation(DateOps.isAfter, {
    name: 'Is Date After?',
    description: 'Determines whether [value] is after [test] with the same unit of time [unit]',
    singleline: '{value} is after {test} in the same {unit}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      unit: 'The unit of time to use to compare the two dates',
    },
    defaults: {
      unit: 'milliseconds',
    },
    returnComments: 'True if [value] is after [test], otherwise false.',
  });

  registry.addOperation(DateOps.isAfterOrEqual, {
    name: 'Is Date After or On?',
    description: 'Determines whether [value] is after or on [test] with the same unit of time [unit]',
    singleline: '{value} is after or on {test} in the same {unit}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
      unit: 'The unit of time to use to compare the two dates',
    },
    defaults: {
      unit: 'milliseconds',
    },
    returnComments: 'True if [value] is after or equal to [test], otherwise false.',
  });

  registry.addOperation(DateOps.isBetween, {
    name: 'Is Date in Range?',
    description: 'Determines whether [value] is between [start] [startInclusive] and [end] [endInclusive] with the same unit of time [unit]',
    singleline: '{start} < {value} < {end} in the same {unit} where start is inclusive {startInclusive} and end is inclusive {endInclusive}',
    singlelineReadonly: (params) => '{start} ' + 
      ifExpr(params.startInclusive, '<', '<=') + ' {value} < {end} in the same {unit}' + 
      ifExpr(params.startInclusive, ' where start is inclusive {startInclusive}') + 
      ifExpr(params.endInclusive, ' and end is inclusive {endInclusive}'),
    comments: {
      value: 'The value to evaluate',
      start: 'The start date of the range',
      end: 'The end date of the range',
      unit: 'The unit of time to use to compare the dates',
      startInclusive: 'If the start date should be inclusive',
      endInclusive: 'If the end date should be inclusive',
    },
    defaults: {
      unit: 'milliseconds',
      startInclusive: 'true',
      endInclusive: 'false',
    },
    returnComments: 'True if [value] is between [start] and [end], otherwise false',
  });

  registry.addOperation(DateOps.isStartOf, {
    name: 'Is Date at Start Of?',
    description: 'Determines whether [value] is start of unit [unit]',
    singleline: '{value} is start of {unit}',
    comments: {
      value: 'The value to evaluate',
      unit: 'The unit of time to use to compare the dates',
    },
    returnComments: 'True if [value] is at the start of the [unit], otherwise false.',
  });

  registry.addOperation(DateOps.isEndOf, {
    name: 'Is Date at End Of?',
    description: 'Determines whether [value] is end of unit [unit], inclusive [inclusive]',
    singleline: '{value} is end of {unit} inclusive {inclusive}',
    singlelineReadonly: (params) => '{value} is end of {unit}' + 
      ifExpr(params.inclusive, ' inclusive {inclusive}', ' (exclusive)'),
    comments: {
      value: 'The value to evaluate',
      unit: 'The unit of time to use to compare the dates',
      inclusive: 'If the end of unit should be inclusive',
    },
    defaults: {
      inclusive: 'false',
    },
    returnComments: 'True if [value] is at the end of the [unit], otherwise false.',
  });

  registry.addOperation(DateOps.isDST, {
    name: 'Is Daylight Savings Time?',
    description: 'Determines whether [value] is in daylight savings time',
    singleline: '{value} is DST',
    comments: {
      value: 'The date value',
    },
    returnComments: 'True if [value] is in Daylights Saving Time, otherwise false.',
  });

  registry.addOperation(DateOps.isLeapYear, {
    name: 'Is Leap Uear?',
    description: 'Determines whether [value] is in a leap year',
    singleline: '{value} is Leap Year?',
    comments: {
      value: 'The date value',
    },
    returnComments: 'True if [value] is in a leap year, otherwise false.',
  });

  registry.addOperation(DateOps.asAny, {
    name: 'Cast Date to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asBoolean, {
    name: 'Cast Date to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'true',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asColor, {
    name: 'Cast Date to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'White',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asDate, {
    name: 'Cast Date to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asList, {
    name: 'Cast Date to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The [value] converted to a list by returning it as a list with a single item.',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asMap, {
    name: 'Cast Date to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A map with a single key-value pair of "value" and [value]',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asNumber, {
    name: 'Cast Date to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The millisecond timestamp of [value]',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asObject, {
    name: 'Cast Date to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'An object with a single property "value" and [value]',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asText, {
    name: 'Cast Date to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The [value] converted to text using the ISO format.',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asTuple, {
    name: 'Cast Date to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A tuple with a single [value] element.',
    weight: 0.5,
  });

  registry.addOperation(DateOps.asSet, {
    name: 'Cast Date to Set',
    description: 'Cast [value] to Set',
    singleline: '{value} as set',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A set with a single [value] value.',
    weight: 0.5,
  });

};
