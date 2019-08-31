
import { TextType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { TextBoxInput } from './TextBoxTypes';
import { TextAreaInput } from './TextAreaTypes';
import { TextComboInput } from './TextComboTypes';
import { TextRadioInput } from './TextRadioTypes';
import TextEditor from './TextEditor.vue';
import TextOptions from './TextOptions.vue';


export const TextVisuals = createVisuals({
  type: TextType,
  name: 'Text',
  description: 'A text value',
  editor: TextEditor,
  options: TextOptions,
  defaultInput: 'textbox',
  inputsOrder: ['textbox', 'textarea', 'combo', 'radio'],
  inputs: {
    textbox: TextBoxInput,
    textarea: TextAreaInput,
    combo: TextComboInput,
    radio: TextRadioInput,
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

