
import { NumberType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { NumberTextBoxInput } from './NumberTextBoxTypes';
import { NumberSliderInput } from './NumberSliderTypes';
import { NumberComboInput } from './NumberComboTypes';
import NumberEditor from './NumberEditor.vue';


const NumberVisuals: TypeVisuals<NumberType, true, false> = 
{
  type: NumberType,
  newInstance: () => new NumberType({}),
  name: 'Number',
  description: 'A number value',
  editor: NumberEditor,
  buildable: true,
  buildLabel: 'Number',
  onBuild: async () => ({
    type: new NumberType({ }), 
    settings: { 
      input: 'textbox', 
      defaultValue: 0,
      options: NumberTextBoxInput.getDefaultOptions(), 
    },
  }),
  defaultInput: 'textbox',
  inputsOrder: ['textbox', 'slider', 'combo'],
  inputs: {
    textbox: NumberTextBoxInput,
    slider: NumberSliderInput,
    combo: NumberComboInput,
  },
};

export default NumberVisuals;
