import { NumberOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(NumberOps.create, {
    name: 'Create Number',
    description: 'Create a Number value (0)',
    singleline: '0',
    comments: {},
  });

  registry.addOperation(NumberOps.pi, {
    name: 'PI',
    description: '3.14159265359',
    singleline: 'pi',
    comments: {},
  });

  registry.addOperation(NumberOps.pi2, {
    name: '2PI',
    description: '6.28318530718',
    singleline: '2pi',
    comments: {},
  });

  registry.addOperation(NumberOps.piHalf, {
    name: 'PI / 2',
    description: 'PI / 2',
    singleline: 'pi / 2',
    comments: {},
  });

  registry.addOperation(NumberOps.piHalf, {
    name: 'PI / 2',
    description: '1.57079632679',
    singleline: 'pi / 2',
    comments: {},
  });

  registry.addOperation(NumberOps.e, {
    name: 'e',
    description: '2.71828',
    singleline: 'e',
    comments: {},
  });

  registry.addOperation(NumberOps.sqrt2, {
    name: 'Square root of 2',
    description: '1.41421356237',
    singleline: 'sqrt(2)',
    comments: {},
  });

  registry.addOperation(NumberOps.sqrt12, {
    name: 'Square root of 1/2',
    description: '0.70710678118',
    singleline: 'sqrt(1/2)',
    comments: {},
  });

  registry.addOperation(NumberOps.ln2, {
    name: 'Natural logarithm of 2',
    description: '0.69314718056',
    singleline: 'ln(2)',
    comments: {},
  });

  registry.addOperation(NumberOps.ln10, {
    name: 'Natural logarithm of 10',
    description: '2.30258509299',
    singleline: 'ln(10)',
    comments: {},
  });

  registry.addOperation(NumberOps.log2e, {
    name: 'Logarithm of 2',
    description: '0.30102999566',
    singleline: 'log(2)',
    comments: {},
  });

  registry.addOperation(NumberOps.log10e, {
    name: 'Logarithm of 10',
    description: '1',
    singleline: 'log(10)',
    comments: {},
  });

  registry.addOperation(NumberOps.add, {
    name: 'Addition',
    description: '[value] + [addend]',
    singleline: '{value} + {addend}',
    comments: {
      value: 'The first number',
      addend: 'The second number',
    },
  });

  registry.addOperation(NumberOps.sub, {
    name: 'Subtraction',
    description: '[value] - [subtrahend]',
    singleline: '{value} - {subtrahend}',
    comments: {
      value: 'The first number',
      subtrahend: 'The second number',
    },
  });

  registry.addOperation(NumberOps.mul, {
    name: 'Multiplication',
    description: '[value] x [multiplier]',
    singleline: '{value} x {multiplier}',
    comments: {
      value: 'The first number',
      multiplier: 'The second number',
    },
  });

  registry.addOperation(NumberOps.div, {
    name: 'Division',
    description: '[value] / [divisor]',
    singleline: '{value} / {divisor}',
    comments: {
      value: 'The first number',
      divisor: 'The second number',
    },
  });

  registry.addOperation(NumberOps.mod, {
    name: 'Modulus',
    description: '[value] % [divisor]',
    singleline: '{value} % {divisor}',
    comments: {
      value: 'The first number',
      divisor: 'The second number',
    },
  });

  registry.addOperation(NumberOps.min, {
    name: 'Min',
    description: 'Minimum value between [a] and [b]',
    singleline: 'min of {a} and {b}',
    comments: {
      a: 'The first number',
      b: 'The second number',
    },
  });

  registry.addOperation(NumberOps.max, {
    name: 'Max',
    description: 'Maximum value between [a] and [b]',
    singleline: 'max of {a} and {b}',
    comments: {
      a: 'The first number',
      b: 'The second number',
    },
  });

  registry.addOperation(NumberOps.pow, {
    name: 'Power/Exponent',
    description: 'Computes [value] raised to an [exponent]',
    singleline: '{value} ^ {exponent}',
    comments: {
      value: 'The number',
      exponent: 'The exponent',
    },
  });

  registry.addOperation(NumberOps.atan2, {
    name: 'Atan 2',
    description: 'Computes angle in radians of vector [x], [y]',
    singleline: 'and in radians of {x}, {y}',
    comments: {
      x: 'The x magnitude of the vector',
      y: 'The y magnitude of the vector',
    },
  });

  registry.addOperation(NumberOps.hypot, {
    name: 'Hypotenuse',
    description: 'Computes hypotenuse of right angle triangle with sides of lengths [a] and [b]',
    singleline: 'hypotenuse of triangle with sides {a} and {b}',
    comments: {
      a: 'The length of side 1 that shares the right angle',
      b: 'The length of side 2 that shares the right angle',
    },
  });

  registry.addOperation(NumberOps.choose, {
    name: 'Choose',
    description: 'Number of combinations of size [k] from a set size of [n]',
    singleline: 'hypotenuse of triangle with sides {a} and {b}',
    comments: {
      a: 'The length of side 1 that shares the right angle',
      b: 'The length of side 2 that shares the right angle',
    },
  });



  registry.addOperation(NumberOps.maybe, {
    name: 'Try Number?',
    description: 'If the [value] is number, return the number value, otherwise return undefined',
    singleline: '{value} to number?',
    comments: {
      value: 'The value to convert to number or undefined',
    },
  });

  registry.addOperation(NumberOps.and, {
    name: 'And',
    description: 'Return true if both [a] and [b] are true',
    singleline: '{a} and {b}',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
  });

  registry.addOperation(NumberOps.or, {
    name: 'Or',
    description: 'Return true if either [a] or [b] are true',
    singleline: '{a} or {b}',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
  });

  registry.addOperation(NumberOps.xor, {
    name: 'Xor',
    description: 'Return true if either [a] or [b] are true but not both',
    singleline: '{a} or {b} but not both',
    comments: {
      a: 'The first value',
      b: 'The second value',
    },
  });

  registry.addOperation(NumberOps.not, {
    name: 'Not',
    description: 'Return true if [a] is false',
    singleline: '!{a}',
    comments: {
      a: 'The value to negate',
    },
  });

  registry.addOperation(NumberOps.cmp, {
    name: 'Compare Boolean',
    description: 'Compare [value] and [test] and return 0 when equal, +n when [value] < [test] and -n when [value] > [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The value to compare',
      test: 'The test value to compare against',
    },
  });

  registry.addOperation(NumberOps.isValid, {
    name: 'Is Boolean?',
    description: 'Determines whether [value] is a valid value for Boolean',
    singleline: 'is {value} boolean?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(NumberOps.isTrue, {
    name: 'Is True?',
    description: 'Determines whether [value] is true',
    singleline: '{value} is true',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(NumberOps.isFalse, {
    name: 'Is False?',
    description: 'Determines whether [value] is false',
    singleline: '{value} is false',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(NumberOps.asAny, {
    name: 'Cast Boolean to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asBoolean, {
    name: 'Cast Boolean to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asDate, {
    name: 'Cast Boolean to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asList, {
    name: 'Cast Boolean to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asMap, {
    name: 'Cast Boolean to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asNumber, {
    name: 'Cast Boolean to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asObject, {
    name: 'Cast Boolean to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asText, {
    name: 'Cast Boolean to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asTuple, {
    name: 'Cast Boolean to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
  });

};
