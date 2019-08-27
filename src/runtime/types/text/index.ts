
import { TextType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { TextBoxInput } from './TextBoxTypes';
import { TextAreaInput } from './TextAreaTypes';
import { TextComboInput } from './TextComboTypes';
import TextEditor from './TextEditor.vue';


const TextVisuals: TypeVisuals<TextType, true, false> = 
{
  type: TextType,
  newInstance: () => new TextType({}),
  name: 'Text',
  description: 'A text value',
  editor: TextEditor,
  buildable: true,
  buildLabel: 'Text',
  onBuild: async () => ({
    type: new TextType({ }), 
    settings: { 
      input: 'textbox', 
      defaultValue: '',
      options: TextBoxInput.getDefaultOptions(), 
    },
  }),
  defaultInput: 'textbox',
  inputsOrder: ['textbox', 'textarea', 'combo'],
  inputs: {
    textbox: TextBoxInput,
    textarea: TextAreaInput,
    combo: TextComboInput,
  },
};

export default TextVisuals;
