import { ColorOps } from 'expangine-runtime';
import { Registry } from '../Registry';


export default (registry: Registry) =>
{

  registry.addOperation(ColorOps.create, {
    name: 'Create Color',
    description: 'Create a Color value (white)',
    singleline: 'create color',
    comments: {},
    returnComments: 'white',
  });

  registry.addOperation(ColorOps.maybe, {
    name: 'Try Color?',
    description: 'If the [value] is color, return the color value, otherwise return undefined',
    singleline: '{value} to color?',
    comments: {
      value: 'The value to convert to color or undefined',
    },
    returnComments: 'color or undefine',
  });

  registry.addOperation(ColorOps.cmp, {
    name: 'Compare Colors',
    description: 'Compares colors [value] and [test]',
    singleline: 'compare {value} and {test}',
    comments: {
      value: 'The first color to compare',
      test: 'The second color to compare',
    },
    returnComments: 'Return 0 when [value] and [test] are equal, a negative number when [value] has properties [test] does not and a positive number when [value] is missing properties that [test] has.',
  });

  registry.addOperation(ColorOps.build, {
    name: 'Build Color',
    description: 'Build color with [r], [g], [b], [a]',
    singleline: 'new color r={r} g={g} b={b} a={a}',
    comments: {
      r: 'The red component',
      g: 'The green component',
      b: 'The blue component',
      a: 'The alpha component',
    },
    defaults: {
      a: '255',
    },
    returnComments: 'A color with RGBA values.',
  });

  registry.addOperation(ColorOps.map, {
    name: 'Map Color',
    description: 'map color [value] with [r], [g], [b], [a]',
    singleline: 'new color r={r} g={g} b={b} a={a}',
    comments: {
      value: 'The color to map to a new color',
      r: 'A new red component based on the current',
      g: 'A new green component based on the current',
      b: 'A new blue component based on the current',
      a: 'A new alpha component based on the current',
    },
    scopeComments: {
      value: 'The value of the component being mapped',
      component: 'The component being mapped (r, g, b, or a)',
    },
    defaults: {
      a: '255',
    },
    returnComments: 'A color with RGBA values.',
  });

  registry.addOperation(ColorOps.op, {
    name: 'Generic Color Operation',
    description: 'color operation between [value] and [test] with [r], [g], [b], [a]',
    singleline: 'operate on {value} and {test} with r={r} g={g} b={b} a={a}',
    comments: {
      value: 'The first color to operate on',
      test: 'The second color to operate on',
      r: 'A new red component based on the current',
      g: 'A new green component based on the current',
      b: 'A new blue component based on the current',
      a: 'A new alpha component based on the current',
    },
    scopeComments: {
      value: 'The value of the first component being operated on',
      test: 'The value of the second component being operated on',
      component: 'The component being operated on (r, g, b, or a)',
    },
    defaults: {
      a: '255',
    },
    returnComments: 'A color with RGBA values.',
  });

  registry.addOperation(ColorOps.clamp, {
    name: 'Fix Color',
    description: 'clamp [value] so all components are within range',
    singleline: 'clamp {value}',
    comments: {
      value: 'The color to adjust the components of so they are in the range of 0 and 255',
    },
    returnComments: 'A color with clamped RGBA values.',
  });

  registry.addOperation(ColorOps.add, {
    name: 'Add Colors',
    description: '[value] + [addend]',
    singleline: '{value} + {addend} including alpha {alpha}',
    comments: {
      value: 'The first color to add',
      addend: 'The second color to add',
      alpha: 'True if the alpha components should be operated on, otherwise the alpha in [value] is used',
    },
    defaults: {
      alpha: 'true',
    },
    returnComments: 'The sum of [value] and [addend].',
  });

  registry.addOperation(ColorOps.adds, {
    name: 'Add Scaled Color',
    description: '[value] + [addend] * [addendScale]',
    singleline: '{value} + {subtrahend} * {addendScale} including alpha {alpha}',
    comments: {
      value: 'The color to add to',
      addend: 'The color to add, scaled by some value',
      addendScale: 'The amount to scale [addend] by when adding it to [value]',
      alpha: 'True if the alpha components should be operated on, otherwise the alpha in [value] is used',
    },
    defaults: {
      alpha: 'true',
    },
    returnComments: 'The sum of [value] and [addend] * [addendScale].',
  });

  registry.addOperation(ColorOps.sub, {
    name: 'Subtract Colors',
    description: '[value] - [subtrahend]',
    singleline: '{value} - {subtrahend} including alpha {alpha}',
    comments: {
      value: 'The color to subtract from',
      subtrahend: 'The color to subtract',
      alpha: 'True if the alpha components should be operated on, otherwise the alpha in [value] is used',
    },
    defaults: {
      alpha: 'true',
    },
    returnComments: 'The difference of [value] and [subtrahend].',
  });

  registry.addOperation(ColorOps.mul, {
    name: 'Multiply Colors',
    description: '[value] * [multiplier]',
    singleline: '{value} * {multiplier} including alpha {alpha}',
    comments: {
      value: 'The color to multiply',
      multiplier: 'The amount to multiply by',
      alpha: 'True if the alpha components should be operated on, otherwise the alpha in [value] is used',
    },
    defaults: {
      alpha: 'true',
    },
    returnComments: 'The product of [value] and [multiplier].',
  });

  registry.addOperation(ColorOps.div, {
    name: 'Divide Colors',
    description: '[value] / [divisor]',
    singleline: '{value} / {divisor} including alpha {alpha}',
    comments: {
      value: 'The color to multiply',
      divisor: 'The amount to divide by',
      alpha: 'True if the alpha components should be operated on, otherwise the alpha in [value] is used',
    },
    defaults: {
      alpha: 'true',
    },
    returnComments: 'The quotient of [value] and [divisor].',
  });

  registry.addOperation(ColorOps.mod, {
    name: 'Modulus Colors',
    description: '[value] % [divisor]',
    singleline: '{value} % {divisor} including alpha {alpha}',
    comments: {
      value: 'The color to mod',
      divisor: 'The amount to mod by',
      alpha: 'True if the alpha components should be operated on, otherwise the alpha in [value] is used',
    },
    defaults: {
      alpha: 'true',
    },
    returnComments: 'The remainder of [value] divided by [divisor].',
  });

  registry.addOperation(ColorOps.format, {
    name: 'Format Color',
    description: 'format [value] with [format]',
    singleline: '{value} to {format}',
    comments: {
      value: 'The color to format',
      format: 'The format of the color',
    },
    returnComments: 'The formatted text of the color.',
  });

  registry.addOperation(ColorOps.parse, {
    name: 'Parse Color',
    description: 'parse color from [value]',
    singleline: 'parse color {value}',
    comments: {
      value: 'The value to parse into a color',
    },
    returnComments: 'The parsed color or none if invalid [value].',
  });

  registry.addOperation(ColorOps.lerp, {
    name: 'Interpolate Color',
    description: 'Computes linear interpolation between [start] and [end] with a delta value of [delta]',
    singleline: 'lerp between range {start} and {end} with delta {delta}',
    comments: {
      start: 'The start of the linear interpolation range. The result will return this value when delta is 0.',
      end: 'The end of the lineary interpolation range. The result will return this value when delta is 1',
      delta: 'A value typically between 0 and 1 that determines the value returned between [start] and [end]',
    },
    returnComments: 'The linear interpolation [delta] between [start] and [end].',
  });

  registry.addOperation(ColorOps.lighten, {
    name: 'Lighten Color',
    description: 'Lighten [value] by [amount]',
    singleline: 'lighten {value} by {amount}',
    comments: {
      value: 'The color to lighten',
      amount: 'The amount to lighten by. A value between 0 and 1 where 0 is the given color and 1 is white.',
    },
    returnComments: 'The lightened color.',
  });

  registry.addOperation(ColorOps.darken, {
    name: 'Darken Color',
    description: 'Darken [value] by [amount]',
    singleline: 'darken {value} by {amount}',
    comments: {
      value: 'The color to darken',
      amount: 'The amount to darken by. A value between 0 and 1 where 0 is the given color and 1 is black.',
    },
    returnComments: 'The darkened color.',
  });

  registry.addOperation(ColorOps.toHSL, {
    name: 'Color to HSL',
    description: 'Convert [value] to HSL (hue, saturation, lightness)',
    singleline: '{value} to HSL',
    comments: {
      value: 'The color to convert to HSL',
    },
    returnComments: 'The HSL of the given color.',
  });

  registry.addOperation(ColorOps.fromHSL, {
    name: 'HSL to Color',
    description: 'Convert HSL [value] to color',
    singleline: 'HSL {value} to color',
    comments: {
      value: 'The HSL to convert to a color',
    },
    returnComments: 'The RGB color of the given HSL.',
  });

  registry.addOperation(ColorOps.luminance, {
    name: 'Color Luminance',
    description: 'Compute the luminance of [value]',
    singleline: 'luminance of {value}',
    comments: {
      value: 'The color to compute the luminance of',
    },
    returnComments: 'The luminance of the given color, between 0 and 1.',
  });

  registry.addOperation(ColorOps.contrast, {
    name: 'Contrast between Colors',
    description: 'Computes how much contrast there is between two colors',
    singleline: 'contrast of {value} and {test}',
    comments: {
      value: 'The first color',
      test: 'The second color',
    },
    returnComments: 'The contrast amount between the two colors.',
  });

  registry.addOperation(ColorOps.invert, {
    name: 'Invert Color',
    description: 'Invert the color [value]',
    singleline: 'invert {value} including alpha {alpha}',
    comments: {
      value: 'The color to invert',
      alpha: 'True if the alpha components should be operated on, otherwise the alpha in [value] is used',
    },
    defaults: {
      alpha: 'false',
    },
    returnComments: 'The inversion of [value]',
  });

  registry.addOperation(ColorOps.opaque, {
    name: 'Opaque Color',
    description: 'Remove transparency from [value]',
    singleline: 'remove transparency from {value}',
    comments: {
      value: 'The color to remove the transparency from',
    },
    returnComments: 'The color which is fully opaque.',
  });

  registry.addOperation(ColorOps.alpha, {
    name: 'Translucent Color',
    description: 'Set transparency in [value] to [alpha]',
    singleline: 'set transparency in {value} to {alpha}',
    comments: {
      value: 'The color to set the transparency of',
      alpha: 'The alpha of the returned color, between 0 and 255',
    },
    returnComments: 'The color [value] with alpha [alpha]',
  });

  registry.addOperation(ColorOps.distance, {
    name: 'Distance between Colors',
    description: 'Distance between [value] and [test]',
    singleline: 'Distance between {value} to {†est}',
    comments: {
      value: 'The first color',
      test: 'The second color',
    },
    returnComments: 'The distance between the two colors, between 0 and 4,294,967,295.',
  });

  registry.addOperation(ColorOps.named, {
    name: 'Named Color',
    description: 'Get color with [name]',
    singleline: 'color named {name}',
    comments: {
      name: 'The name of the color',
    },
    returnComments: 'The color with the given name',
  });

  registry.addOperation(ColorOps.getName, {
    name: 'Name of Color',
    description: 'Finds the color name closest to [value]',
    singleline: 'name of {value}',
    comments: {
      value: 'The color to name',
    },
    returnComments: 'The name of the color closest to [value]',
  });

  registry.addOperation(ColorOps.blend, {
    name: 'Blend Colors',
    description: 'Blends [top] and [bottom] with [mode]',
    singleline: 'blend {top} and {bottom} with {mode}',
    comments: {
      top: 'The color on top (foreground) to blend',
      bottom: 'The color on bottom (background) to blend',
      mode: 'The blending mode to use',
    },
    returnComments: 'The result of the blending operation.',
  });

  registry.addOperation(ColorOps.isValid, {
    name: 'Is Color?',
    description: 'Determines whether [value] is a valid value for Color',
    singleline: 'is {value} color?',
    comments: {
      value: 'The value to evaluate',
    },
    returnComments: 'True if [value] is an color, otherwise false.',
  });

  registry.addOperation(ColorOps.isEqual, {
    name: 'Colors Equal?',
    description: 'Determines whether [value] is equal to [test]',
    singleline: '{value} equals {test} within {epsilon}',
    comments: {
      value: 'The color to evaluate',
      test: 'The test object to compare against',
      epsilon: 'How many component values can be off for two colors to be considered equal',
    },
    defaults: {
      epsilon: '0',
    },
    returnComments: 'True if [value] equals [test], otherwise false',
  });

  registry.addOperation(ColorOps.isNotEqual, {
    name: 'Colors Not Equal?',
    description: 'Determines whether [value] is not equal to [test]',
    singleline: '{value} not equal to {test} within {epsilon}',
    comments: {
      value: 'The color to evaluate',
      test: 'The test color to compare against',
      epsilon: 'How many component values can be off for two colors to be considered equal',
    },
    defaults: {
      epsilon: '0',
    },
    returnComments: 'True if [value] is not equal to [test], otherwise false',
  });

  registry.addOperation(ColorOps.isLess, {
    name: 'Is Color Less?',
    description: 'Determines whether [value] is less than [test]',
    singleline: '{value} < {test}',
    comments: {
      value: 'The color to evaluate',
      test: 'The test color to compare against',
    },
    returnComments: 'True if [value] is less than [test], otherwise false.',
  });

  registry.addOperation(ColorOps.isLessOrEqual, {
    name: 'Is Color Less or Equal?',
    description: 'Determines whether [value] is less than or equal to [test]',
    singleline: '{value} <= {test}',
    comments: {
      value: 'The color to evaluate',
      test: 'The test color to compare against',
    },
    returnComments: 'True if [value] is less than or equal to [test], otherwise false.',
  });

  registry.addOperation(ColorOps.isGreater, {
    name: 'Is Color Greater?',
    description: 'Determines whether [value] is greater than [test]',
    singleline: '{value} > {test}',
    comments: {
      value: 'The color to evaluate',
      test: 'The test color to compare against',
    },
    returnComments: 'True if [value] is greater than [test], otherwise false.',
  });

  registry.addOperation(ColorOps.isGreaterOrEqual, {
    name: 'Is Color Greater or Equal?',
    description: 'Determines whether [value] is greater than or equal to [test]',
    singleline: '{value} >= {test}',
    comments: {
      value: 'The color to evaluate',
      test: 'The test color to compare against',
    },
    returnComments: 'True if [value] is greater than or equal to [test], otherwise false.',
  });

  registry.addOperation(ColorOps.asAny, {
    name: 'Cast Color to Any',
    description: 'Cast [value] to Any',
    singleline: '{value} as any',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asBoolean, {
    name: 'Cast Color to Boolean',
    description: 'Cast [value] to Boolean',
    singleline: '{value} as boolean',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'True',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asColor, {
    name: 'Cast Color to Color',
    description: 'Cast [value] to Color',
    singleline: '{value} as color',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asList, {
    name: 'Cast Color to List',
    description: 'Cast [value] to List',
    singleline: '{value} as list',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The [value] converted to a list by returning it as a list with a single item.',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asDate, {
    name: 'Cast Color to Date',
    description: 'Cast [value] to Date',
    singleline: '{value} as date',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The current date & time.',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asMap, {
    name: 'Cast Color to Map',
    description: 'Cast [value] to Map',
    singleline: '{value} as map',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A map with a single key-value pair of "value" and [value].',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asNumber, {
    name: 'Cast Color to Number',
    description: 'Cast [value] to Number',
    singleline: '{value} as number',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A number with 4 bytes, 1 for each color component in [value].',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asObject, {
    name: 'Cast Color to Object',
    description: 'Cast [value] to Object',
    singleline: '{value} as object',
    comments: {
      value: 'The value to cast',
    },
    returnComments: '[value]',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asText, {
    name: 'Cast Color to Text',
    description: 'Cast [value] to Text',
    singleline: '{value} as text',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'The color formatted as text.',
    weight: 0.5,
  });

  registry.addOperation(ColorOps.asTuple, {
    name: 'Cast Color to Tuple',
    description: 'Cast [value] to Tuple',
    singleline: '{value} as tuple',
    comments: {
      value: 'The value to cast',
    },
    returnComments: 'A tuple with a single [value] element.',
    weight: 0.5,
  });

};
