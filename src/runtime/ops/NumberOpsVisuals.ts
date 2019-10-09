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
    description: 'Computes hypotenuse of a right angle triangle with sides of lengths [a] and [b]',
    singleline: 'hypotenuse of triangle with sides {a} and {b}',
    comments: {
      a: 'The length of side 1 that shares the right angle',
      b: 'The length of side 2 that shares the right angle',
    },
  });

  registry.addOperation(NumberOps.choose, {
    name: 'Choose',
    description: 'Number of combinations of size [k] from a set size of [n]',
    singleline: '{n} choose {k}',
    comments: {
      n: 'The total number of things to choose from',
      k: 'The size of the sets being chosen and counted',
    },
  });

  registry.addOperation(NumberOps.gcd, {
    name: 'Greatest Common Denominator',
    description: 'Returns the greatest common denominator between [a] and [b]',
    singleline: 'gcd of {a} and {b}',
    comments: {
      a: 'The first number',
      b: 'The second number',
    },
  });

  registry.addOperation(NumberOps.bitAnd, {
    name: 'Bitwise AND',
    description: 'Performs a bitwise AND operation between [a] and [b]',
    singleline: '{a} bitwise and {b}',
    comments: {
      a: 'The first number',
      b: 'The second number',
    },
  });

  registry.addOperation(NumberOps.bitOr, {
    name: 'Bitwise OR',
    description: 'Performs a bitwise OR operation between [a] and [b]',
    singleline: '{a} bitwise or {b}',
    comments: {
      a: 'The first number',
      b: 'The second number',
    },
  });

  registry.addOperation(NumberOps.bitXor, {
    name: 'Bitwise XOR',
    description: 'Performs a bitwise XOR operation between [a] and [b]',
    singleline: '{a} bitwise xor {b}',
    comments: {
      a: 'The first number',
      b: 'The second number',
    },
  });

  registry.addOperation(NumberOps.cmp, {
    name: 'Compare Number',
    description: 'Compare [value] and [test] and return 0 when equal, +n when [value] < [test] and -n when [value] > [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The value to compare',
      test: 'The test value to compare against',
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

  registry.addOperation(NumberOps.sqrt, {
    name: 'Square Root',
    description: 'Square root of [value]',
    singleline: 'square root {value}',
    comments: {
      value: 'The value to find the square root of',
    },
  });

  registry.addOperation(NumberOps.sqrt, {
    name: 'Square',
    description: 'Square of [value] (value * value)',
    singleline: 'square {value}',
    comments: {
      value: 'The value to find the square of',
    },
  });

  registry.addOperation(NumberOps.cbrt, {
    name: 'Cube Root',
    description: 'Cube root of [value]',
    singleline: 'cube root {value}',
    comments: {
      value: 'The value to find the cube root of',
    },
  });

  registry.addOperation(NumberOps.floor, {
    name: 'Floor',
    description: 'Floor of [value] (round down)',
    singleline: 'floor {value}',
    comments: {
      value: 'The value to find the floor of',
    },
  });

  registry.addOperation(NumberOps.ceil, {
    name: 'Ceil',
    description: 'Ceil of [value] (round up)',
    singleline: 'ceil {value}',
    comments: {
      value: 'The value to find the ceil of',
    },
  });

  registry.addOperation(NumberOps.up, {
    name: 'Up',
    description: 'Round up when [value] is positive, round down when negative',
    singleline: 'up {value}',
    comments: {
      value: 'The value to find the rounded up value of',
    },
  });

  registry.addOperation(NumberOps.down, {
    name: 'Down',
    description: 'Round down when [value] is positive, round up when negative',
    singleline: 'down {value}',
    comments: {
      value: 'The value to find the rounded down value of',
    },
  });

  registry.addOperation(NumberOps.round, {
    name: 'Round',
    description: 'Round [value] down when decimal < 0.5, otherwise round up',
    singleline: 'round {value}',
    comments: {
      value: 'The value to find the rounded value of',
    },
  });

  registry.addOperation(NumberOps.abs, {
    name: 'Absolute Value',
    description: 'Absolute value of [value]',
    singleline: 'abs {value}',
    comments: {
      value: 'The value to find the absolute value of',
    },
  });

  registry.addOperation(NumberOps.abs, {
    name: 'Negate Value',
    description: 'Negate value of [value]',
    singleline: '- {value}',
    comments: {
      value: 'The value to find the negative value of',
    },
  });

  registry.addOperation(NumberOps.sign, {
    name: 'Sign',
    description: 'Sign of [value]. When [value] = 0, 0. When [value] > 0, 1, otherwise -1',
    singleline: 'sign {value}',
    comments: {
      value: 'The value to find the sign of',
    },
  });

  registry.addOperation(NumberOps.log, {
    name: 'Logarithm',
    description: 'Returns natural logarithm (base e) of [value]',
    singleline: 'log {value}',
    comments: {
      value: 'The value to find the log of',
    },
  });

  registry.addOperation(NumberOps.sin, {
    name: 'Sine',
    description: 'Sine of [value]',
    singleline: 'sin {value}',
    comments: {
      value: 'The radians to find the sine of',
    },
  });

  registry.addOperation(NumberOps.cos, {
    name: 'Cosine',
    description: 'Cosine of [value]',
    singleline: 'cos {value}',
    comments: {
      value: 'The radians to find the cosine of',
    },
  });

  registry.addOperation(NumberOps.tan, {
    name: 'Tangent',
    description: 'Tangent of [value]',
    singleline: 'tan {value}',
    comments: {
      value: 'The radians to find the tangent of',
    },
  });

  registry.addOperation(NumberOps.sinh, {
    name: 'Hyperbolic Sine',
    description: 'Hyperbolic sine of [value]',
    singleline: 'sinh {value}',
    comments: {
      value: 'The value to find the hyperbolic sine of',
    },
  });

  registry.addOperation(NumberOps.cosh, {
    name: 'Hyperbolic Cosine',
    description: 'Hyperbolic cosine of [value]',
    singleline: 'cosh {value}',
    comments: {
      value: 'The value to find the hyperbolic cosine of',
    },
  });

  registry.addOperation(NumberOps.asin, {
    name: 'Arcsine',
    description: 'Arcsine of [value] in radians',
    singleline: 'asin {value}',
    comments: {
      value: 'The value to find the arcsine of',
    },
  });

  registry.addOperation(NumberOps.acos, {
    name: 'Arccosine',
    description: 'Arccosine of [value] in radians',
    singleline: 'acos {value}',
    comments: {
      value: 'The value to find the arccosine of',
    },
  });

  registry.addOperation(NumberOps.atan, {
    name: 'Arctangent',
    description: 'Arctangent of [value] in radians',
    singleline: 'atan {value}',
    comments: {
      value: 'The value to find the arctangent of',
    },
  });

  registry.addOperation(NumberOps.factorial, {
    name: 'Factorial',
    description: 'Factorial of [value]',
    singleline: 'factorial {value}',
    comments: {
      value: 'The value to find the factorial of',
    },
  });

  registry.addOperation(NumberOps.bitFlip, {
    name: 'Bitwise FLIP',
    description: 'Performs a bitwise FLIP of [value]',
    singleline: 'bitwise flip {value}',
    comments: {
      value: 'The value to find the bitwise FLIP of',
    },
  });

  registry.addOperation(NumberOps.clamp, {
    name: 'Clamp',
    description: 'Clamp [value] between [min] and [max]',
    singleline: 'clamp {value} between {min} and {max}',
    comments: {
      value: 'The value to clamp',
      min: 'The minimum value allowed',
      max: 'The maximum value allowed',
    },
  });

  registry.addOperation(NumberOps.triangleHeight, {
    name: 'Triangle Height',
    description: 'Computes triangle height of triangle with [base] length and sides length [side1] and [side2]',
    singleline: 'height of triangle with base {base} and sides {side1} and {side2}',
    comments: {
      base: 'The length of the base of the triangle',
      side1: 'The length of the left or right side of the triangle',
      side2: 'The length of the other side of the triangle',
    },
  });

  registry.addOperation(NumberOps.lerp, {
    name: 'Linear Interpolation',
    description: 'Computes linear interpolation between [start] and [end] with a delta value of [delta]',
    singleline: 'lerp between range {start} and {end} with delta {delta}',
    comments: {
      start: 'The start of the linear interpolation range. The result will return this value when delta is 0.',
      end: 'The end of the lineary interpolation range. The result will return this value when delta is 1',
      delta: 'A value typically between 0 and 1 that determines the value returned between [start] and [end]',
    },
  });

  registry.addOperation(NumberOps.rnd, {
    name: 'Random Number',
    description: 'Return a random number between [min] and [max], optional a [whole] number that can [includeMax]',
    singleline: 'random number between {min} and {max} as a whole number {whole} where the max is inclusive {includeMax}',
    comments: {
      min: 'The minimum random value to return, defaults to 0',
      max: 'The maximum random value to return, defaults to 1',
      whole: 'Whether the result should be a whole number, defaults to false',
      includeMax: 'Whether the max should be a possible result when generating whole numbers',
    },
    defaults: {
      min: '0',
      max: '1',
      whole: 'false',
      includeMax: 'false',
    },
  });

  registry.addOperation(NumberOps.toBaseText, {
    name: 'Format Number to Base Text',
    description: 'Format [value] to the base [base] with a minimum number of digits [minDigits]',
    singleline: 'format {value} to base {base} with a minimum number of digits {minDigits}',
    comments: {
      value: 'The number to format as text',
      base: 'The base to convert the number to',
      minDigits: 'The minimum length of the text returned, padded with zeros',
    },
    defaults: {
      base: '10',
      minDigits: 'none',
    },
  });

  registry.addOperation(NumberOps.toText, {
    name: 'Format Number to Text',
    description: 'Format [value] to text optional with a [prefix] and [suffix], a minimum number of decimal places [minPlaces], a maximum number of decimal places [maxPlaces] or using exponents [useExponnet] and using a [thousandSeparator]',
    singleline: 'format {value} to text with prefix {prefix}, suffix {suffix}, a minimum number of decimal places {minPlaces}, a maximum number of decimal places {maxPlaces}, using exponents {useExponent}, using the thousand separator {thousandSeparator}',
    comments: {
      value: 'The number to format as text',
      prefix: 'The prefix of the result',
      suffix: 'The suffix of the result',
      minPlaces: 'The minimum number of decimal places to return',
      maxPlaces: 'The maximum number of decimal places to return',
      useExponent: 'Whether exponents should be used to express the potentially large or small number',
      thousandSeparator: 'The thousand separator to use for values over 999',
    },
    defaults: {
      prefix: 'none',
      suffix: 'none',
      minPlaces: 'any',
      maxPlaces: 'any',
      useExponent: 'false',
      thousandSeparator: 'no',
    },
  });

  registry.addOperation(NumberOps.isValid, {
    name: 'Is Number?',
    description: 'Determines whether [value] is a valid value for Number',
    singleline: 'is {value} number?',
    comments: {
      value: 'The value to evaluate',
    },
  });

  registry.addOperation(NumberOps.isZero, {
    name: 'Is Zero?',
    description: 'Determines whether [value] is zero with an acceptable range of [epsilon]',
    singleline: '{value} is true',
    comments: {
      value: 'The value to compare',
      epsilon: 'The acceptable error range to check, since decimal values cannot be practically represented perfectly in a program',
    },
    defaults: {
      epsilon: '0.000001',
    },
  });

  registry.addOperation(NumberOps.isEqual, {
    name: 'Numbers Equal?',
    description: 'Determines whether [value] is equal to [test] with an acceptable range of [epsilon]',
    singleline: '{value} equals {test} within {epsilon}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
      epsilon: 'The acceptable error range to check, since decimal values cannot be practically represented perfectly in a program',
    },
    defaults: {
      epsilon: '0.000001',
    },
  });

  registry.addOperation(NumberOps.isNotEqual, {
    name: 'Numbers Not Equal?',
    description: 'Determines whether [value] is not equal to [test] with an acceptable range of [epsilon]',
    singleline: '{value} not equal to {test} within {epsilon}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
      epsilon: 'The acceptable error range to check, since decimal values cannot be practically represented perfectly in a program',
    },
    defaults: {
      epsilon: '0.000001',
    },
  });

  registry.addOperation(NumberOps.isLess, {
    name: 'Is Number Less?',
    description: 'Determines whether [value] is less than [test]',
    singleline: '{value} < {test}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
    },
  });

  registry.addOperation(NumberOps.isLessOrEqual, {
    name: 'Is Number Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test]',
    singleline: '{value} <= {test}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
    },
  });

  registry.addOperation(NumberOps.isGreater, {
    name: 'Is Number Greater?',
    description: 'Determines whether [value] is greater than [test]',
    singleline: '{value} > {test}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
    },
  });

  registry.addOperation(NumberOps.isGreaterOrEqual, {
    name: 'Is Number Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test]',
    singleline: '{value} >= {test}',
    comments: {
      value: 'The first value to compare',
      test: 'The second value to compare',
    },
  });

  registry.addOperation(NumberOps.isBetween, {
    name: 'Is Number Between?',
    description: 'Determines whether [value] is between [min] and [max] where min is inclusive [minInclusive] and max is inclusive [maxInclusive]',
    singleline: '{value} between {min} (inclusive {minInclusive}) and {max} (inclusive {maxInclusive})',
    comments: {
      value: 'The value to compare',
      min: 'The minimum value allowed',
      max: 'The maximum value allowed',
      minInclusive: 'If the minimum value is inclusive',
      maxInclusive: 'If the maximum value is inclusive',
    },
    defaults: {
      minInclusive: 'true',
      maxInclusive: 'true',
    },
  });

  registry.addOperation(NumberOps.isWhole, {
    name: 'Whole Number?',
    description: 'Determines whether [value] is a whole number with an acceptable range of [epsilon]',
    singleline: '{value} is whole within {epsilon}',
    comments: {
      value: 'The value to check for wholeness',
      epsilon: 'The acceptable error range to check, since decimal values cannot be practically represented perfectly in a program',
    },
    defaults: {
      epsilon: '0.000001',
    },
  });

  registry.addOperation(NumberOps.isDecimal, {
    name: 'Decimal Number?',
    description: 'Determines whether [value] is a number with a fractional value with an acceptable range of [epsilon]',
    singleline: '{value} is decimal within {epsilon}',
    comments: {
      value: 'The value to check for a fractional value',
      epsilon: 'The acceptable error range to check, since decimal values cannot be practically represented perfectly in a program',
    },
    defaults: {
      epsilon: '0.000001',
    },
  });

  registry.addOperation(NumberOps.isPositive, {
    name: 'Positive Number?',
    description: 'Determines whether [value] is positive',
    singleline: '{value} is positive',
    comments: {
      value: 'The value to check',
    },
  });

  registry.addOperation(NumberOps.isNegative, {
    name: 'Negative Number?',
    description: 'Determines whether [value] is negative',
    singleline: '{value} is negative',
    comments: {
      value: 'The value to check',
    },
  });

  registry.addOperation(NumberOps.isDivisible, {
    name: 'Number Divisible By?',
    description: 'Determines whether [value] is divisible by [by]with an acceptable range of [epsilon]',
    singleline: '{value} is divisible by {by} within {epsilon}',
    comments: {
      value: 'The value to check',
      by: 'The divisor in the divisibility check',
      epsilon: 'The acceptable error range to check, since decimal values cannot be practically represented perfectly in a program',
    },
    defaults: {
      epsilon: '0.000001',
    },
  });


  registry.addOperation(NumberOps.asAny, {
    name: 'Cast Number to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asBoolean, {
    name: 'Cast Number to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asDate, {
    name: 'Cast Number to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asList, {
    name: 'Cast Number to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asMap, {
    name: 'Cast Number to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asNumber, {
    name: 'Cast Number to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asObject, {
    name: 'Cast Number to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asText, {
    name: 'Cast Number to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
  });

  registry.addOperation(NumberOps.asTuple, {
    name: 'Cast Number to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
  });

};
