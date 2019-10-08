import { BooleanOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(BooleanOps.create, {
    name: 'Create Boolean',
    description: 'Create a Boolean value (false)',
    singleline: 'false',
    comments: {},
  });

  registry.addOperation(BooleanOps.maybe, {
    name: 'Try Boolean?',
    description: 'If the [value] is boolean, return the boolean value, otherwise return undefined',
    singleline: '{value} to boolean?',
    comments: {
      value: 'The value to convert to boolean or undefined',
    },
  });

  registry.addOperation(BooleanOps.and, {
    name: 'And',
    description: 'Return true if both [a] and [b] are true',
    singleline: '{a} and {b}',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
  });

  registry.addOperation(BooleanOps.or, {
    name: 'Or',
    description: 'Return true if either [a] or [b] are true',
    singleline: '{a} or {b}',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
  });

  registry.addOperation(BooleanOps.xor, {
    name: 'Xor',
    description: 'Return true if either [a] or [b] are true but not both',
    singleline: '{a} or {b} but not both',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
  });

  registry.addOperation(BooleanOps.not, {
    name: 'Not',
    description: 'Return true if [a] is false',
    singleline: '!{a}',
    comments: {
      a: 'The value to negate',
    },
  });

  registry.addOperation(BooleanOps.cmp, {
    name: 'Compare Boolean',
    description: 'Compare [value] and [test] and return 0 when equal, +n when [value] < [test] and -n when [value] > [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The value to compare',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(BooleanOps.isValid, {
    name: 'Is Boolean?',
    description: 'Determines whether [value] is a valid value for Boolean',
    singleline: 'is {value} boolean?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(BooleanOps.isTrue, {
    name: 'Is True?',
    description: 'Determines whether [value] is true',
    singleline: '{value} is true',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(BooleanOps.isFalse, {
    name: 'Is False?',
    description: 'Determines whether [value] is false',
    singleline: '{value} is false',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(BooleanOps.asAny, {
    name: 'Cast Boolean to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asBoolean, {
    name: 'Cast Boolean to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asDate, {
    name: 'Cast Boolean to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asList, {
    name: 'Cast Boolean to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asMap, {
    name: 'Cast Boolean to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asNumber, {
    name: 'Cast Boolean to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asObject, {
    name: 'Cast Boolean to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asText, {
    name: 'Cast Boolean to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(BooleanOps.asTuple, {
    name: 'Cast Boolean to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
  });

};
