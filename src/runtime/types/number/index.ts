
import { NumberType, isNumber, isString } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { NumberTextBoxInput } from './NumberTextBoxTypes';
import { NumberSliderInput } from './NumberSliderTypes';
import { NumberComboInput } from './NumberComboTypes';
import { NumberBitDropdownInput } from './NumberBitDropdownTypes';
import NumberEditor from './NumberEditor.vue';
import NumberOptions from './NumberOptions.vue';



export const NumberVisuals = createVisuals()({
  type: NumberType,
  name: () => 'Number',
  description: 'A number value',
  describe: () => 'Number',
  describeLong: (registry, type) =>  
    (type.options.whole ? 'Whole ' : '') + 
    'Number' +
    (isNumber(type.options.min) ? ' min=' + type.options.min : '') +
    (isNumber(type.options.max) ? ' max=' + type.options.max : '')
  ,
  stringify: ({ value }) => isNaN(value) ? 'Not A Number' : value.toString(),
  subNodes: () => [],
  toString: ({ value, type, process, processInvalid }) => {
    if (!isNumber(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    return value.toString();
  },
  subOptions: () => [],
  subSettings: () => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'textbox', 
    defaultValue: 0, 
    options: { 
      ...NumberTextBoxInput.getDefaultOptions(), 
      ...registry.settingsOverrides, 
      label: sub + '',
    },
  }),
  editor: NumberEditor,
  options: NumberOptions,
  defaultInput: 'textbox',
  inputsOrder: ['textbox', 'slider', 'combo', 'bits'],
  inputs: {
    textbox: NumberTextBoxInput,
    slider: NumberSliderInput,
    combo: NumberComboInput,
    bits: NumberBitDropdownInput,
  },
});

export const NumberBuilder: TypeBuilder = 
{
  getOption: () => ({
    text: 'Number',
    description: 'A decimal or whole number',
    priority: 2,
    value: async () => ({
      type: new NumberType({ }), 
      settings: { 
        input: 'textbox', 
        defaultValue: 0,
        options: NumberTextBoxInput.getDefaultOptions(), 
      },
    }),
  }),
};
