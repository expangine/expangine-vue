
import { NumberType, NumberOps, ExpressionBuilder } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { NumberTextBoxInput } from './NumberTextBoxTypes';
import { NumberSliderInput } from './NumberSliderTypes';
import { NumberComboInput } from './NumberComboTypes';
import NumberEditor from './NumberEditor.vue';
import NumberOptions from './NumberOptions.vue';


const ex = new ExpressionBuilder();

export const NumberVisuals = createVisuals({
  type: NumberType,
  name: 'Number',
  description: 'A number value',
  create: () => ex.op(NumberOps.create, {}),
  isValid: () => ex.op(NumberOps.isValid, {value: ex.get('value')}),
  editor: NumberEditor,
  options: NumberOptions,
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
