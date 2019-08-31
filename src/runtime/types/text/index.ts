
import { TextType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { TextBoxInput } from './TextBoxTypes';
import { TextAreaInput } from './TextAreaTypes';
import { TextComboInput } from './TextComboTypes';
import TextEditor from './TextEditor.vue';


export const TextVisuals = createVisuals({
  type: TextType,
  name: 'Text',
  description: 'A text value',
  editor: TextEditor,
  defaultInput: 'textbox',
  inputsOrder: ['textbox', 'textarea', 'combo'],
  inputs: {
    textbox: TextBoxInput,
    textarea: TextAreaInput,
    combo: TextComboInput,
  },
});

export const TextBuilder: TypeBuilder<TextType> = 
{
  getOption: () => ({
    text: 'Text',
    priority: 1,
    value: async () => ({
      type: new TextType({ }), 
      settings: { 
        input: 'textbox', 
        defaultValue: '',
        options: TextBoxInput.getDefaultOptions(), 
      },
    }),
  }),
};

