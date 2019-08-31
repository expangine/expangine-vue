
import { NumberType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { NumberTextBoxInput } from './NumberTextBoxTypes';
import { NumberSliderInput } from './NumberSliderTypes';
import { NumberComboInput } from './NumberComboTypes';
import NumberEditor from './NumberEditor.vue';
import { TypeBuilder } from '@/runtime/TypeBuilder';


export const NumberVisuals = createVisuals({
  type: NumberType,
  name: 'Number',
  description: 'A number value',
  editor: NumberEditor,
  defaultInput: 'textbox',
  inputsOrder: ['textbox', 'slider', 'combo'],
  inputs: {
    textbox: NumberTextBoxInput,
    slider: NumberSliderInput,
    combo: NumberComboInput,
  },
});

export const NumberBuilder: TypeBuilder<NumberType> = 
{
  getOption: () => ({
    text: 'Number',
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
