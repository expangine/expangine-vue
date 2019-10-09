import { AnyOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(AnyOps.cmp, {
    name: 'Compare (any)',
    description: 'Compare [value] and [test] and return 0 when equal, +n when [value] < [test] and -n when [value] > [test]',
    singleline: 'compare any {value} and {test}',
    comments: {
      value: 'The value to compare',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(AnyOps.copy, {
    name: 'Copy (any)',
    description: 'Copy [value]',
    singleline: 'copy {value}',
    comments: {
      value: 'The value to copy',
    },
  });

  registry.addOperation(AnyOps.isDefined, {
    name: 'Is Defined?',
    description: 'Is [value] defined?',
    singleline: 'is {value} defined?',
    comments: {
      value: 'The value to check for a non-null/non-undefined value',
    },
  });

  registry.addOperation(AnyOps.getDefined, {
    name: 'Get Defined',
    description: 'Get defined [value] and call [defined]',
    singleline: 'if {value} defined, pass it to {defined}',
    comments: {
      value: 'The value to check',
      defined: 'The expression to call with the defined value if it exists',
    },
    scopeComments: {
      defined: 'The value that is defined',
    },
  });

  registry.addOperation(AnyOps.coalesce, {
    name: 'Coalesce',
    description: 'Get first defined value from [a], [b], and optionally [c], [d], and [e]',
    singleline: 'coalesce( {a}, {b}, {c}, {d}, {e} )',
    comments: {
      a: 'The first value to check',
      b: 'The first value to check',
      c: 'The first value to check',
      d: 'The first value to check',
      e: 'The first value to check',
    },
    defaults: {
      c: 'none',
      d: 'none',
      e: 'none',
    },
  });

  registry.addOperation(AnyOps.isValid, {
    name: 'Is Any?',
    description: 'Determines whether [value] is a valid value for Any',
    singleline: 'is {value} any?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(AnyOps.isEqual, {
    name: 'Is Equal? (any)',
    description: 'Determines whether [value] is equal to [test]',
    singleline: '{value} equals {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(AnyOps.isNotEqual, {
    name: 'Is Not Equal? (any)',
    description: 'Determines whether [value] is not equal to [test]',
    singleline: '{value} is not equal to {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(AnyOps.isLess, {
    name: 'Is Less Than? (any)',
    description: 'Determines whether [value] is less than [test]',
    singleline: '{value} < {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(AnyOps.isLessOrEqual, {
    name: 'Is Less Than or Equal To? (any)',
    description: 'Determines whether [value] is less than or equal to [test]',
    singleline: '{value} <= {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(AnyOps.isGreater, {
    name: 'Is Greater Than? (any)',
    description: 'Determines whether [value] is greater than [test]',
    singleline: '{value} > {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(AnyOps.isGreaterOrEqual, {
    name: 'Is Greater Than or Equal To? (any)',
    description: 'Determines whether [value] is greater than or equal to [test]',
    singleline: '{value} >= {test}',
    comments: {
      value: 'The value to evaluate',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(AnyOps.asAny, {
    name: 'Cast Any to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asBoolean, {
    name: 'Cast Any to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asDate, {
    name: 'Cast Any to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asList, {
    name: 'Cast Any to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asMap, {
    name: 'Cast Any to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asNumber, {
    name: 'Cast Any to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asObject, {
    name: 'Cast Any to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asText, {
    name: 'Cast Any to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(AnyOps.asTuple, {
    name: 'Cast Any to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
  });

};
