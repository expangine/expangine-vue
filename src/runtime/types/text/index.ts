
import { TextType, isString } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { TextBoxInput } from './TextBoxTypes';
import { TextAreaInput } from './TextAreaTypes';
import { TextComboInput } from './TextComboTypes';
import { TextRadioInput } from './TextRadioTypes';
import TextEditor from './TextEditor.vue';
import TextOptions from './TextOptions.vue';


export const TextVisuals = createVisuals()({
  type: TextType,
  name: 'Text',
  description: 'A text value',
  describe: () => 'Text',
  describeLong: () => 'Text',
  toString: ({ value, type, process, processInvalid }) => {
    if (!isString(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    return value;
  },
  subNodes: () => [],
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = key === 'length'
      ? 'length'
      : '[ index ]';
    const description = key === 'length'
      ? 'The number of characters in the text'
      : 'A character at a given index';

    return { key, value, text, description };
  }),
  subSettings: () => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'textbox', 
    defaultValue: '', 
    options: { ...TextBoxInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub + '' },
  }),
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

export const TextBuilder: TypeBuilder = 
{
  getOption: () => ({
    text: 'Text',
    description: 'Any number of characters',
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

