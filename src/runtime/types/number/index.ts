
import { NumberType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { TextBoxInput } from './TextBoxTypes';
import { SliderInput } from './SliderTypes';
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
  onBuild(parent, parentSettings) {
    return { 
      type: new NumberType({ }), 
      settings: { 
        input: 'textbox', 
        defaultValue: '',
        options: TextBoxInput.getDefaultOptions(), 
      },
    };
  },
  defaultInput: 'textbox',
  inputsOrder: ['textbox', 'slider'],
  inputs: {
    textbox: TextBoxInput,
    slider: SliderInput,
  },
};

export default NumberVisuals;
