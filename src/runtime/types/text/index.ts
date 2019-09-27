
import { TextType, TextOps, ExpressionBuilder } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { TextBoxInput } from './TextBoxTypes';
import { TextAreaInput } from './TextAreaTypes';
import { TextComboInput } from './TextComboTypes';
import { TextRadioInput } from './TextRadioTypes';
import TextEditor from './TextEditor.vue';
import TextOptions from './TextOptions.vue';


const ex = new ExpressionBuilder();

export const TextVisuals = createVisuals({
  type: TextType,
  name: 'Text',
  description: 'A text value',
  exprs: {
    create: () => ex.op(TextOps.create, {}),
    valid: () => ex.op(TextOps.isValid, {value: ex.get('value')}),
    compare: () => ex.op(TextOps.compare, {value: ex.get('value'), test: ex.get('test'), ignoreCase: ex.const(true)}),
  },
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

