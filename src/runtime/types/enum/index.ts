
import { EnumType, TextType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { TextBoxInput } from '../text/TextBoxTypes';
import { EnumSelectInput } from './EnumSelectTypes';
import { EnumAutocompleteInput } from './EnumAutocompleteTypes';
import { EnumSliderInput } from './EnumSliderTypes';
import { EnumRadioInput } from './EnumRadioTypes';
import EnumEditor from './EnumEditor.vue';
import EnumOptions from './EnumOptions.vue';


export const EnumVisuals = createVisuals({
  type: EnumType,
  name: 'Enum',
  description: 'A list of key value pairs.',
  editor: EnumEditor,
  options: EnumOptions,
  defaultInput: 'dropdown',
  inputsOrder: ['dropdown', 'autocomplete', 'slider', 'radio'],
  inputs: {
    dropdown: EnumSelectInput,
    autocomplete: EnumAutocompleteInput,
    slider: EnumSliderInput,
    radio: EnumRadioInput,
  },
});

export const EnumBuilder: TypeBuilder<EnumType> = 
{
  getOption: () => ({
    text: 'Enum',
    description: 'A value which is taken from a list of key-value pairs',
    priority: 7,
    value: async () => ({
      type: new EnumType({ key: new TextType({}), value: new TextType({}), constants: new Map() }),
      settings: {
      input: 'dropdown',
      defaultValue: [],
      options: EnumSelectInput.getDefaultOptions(),
      sub: { 
        key: { 
          input: 'textbox', 
          defaultValue: '',
          options: TextBoxInput.getDefaultOptions(), 
        },
        value: { 
          input: 'textbox', 
          defaultValue: '',
          options: TextBoxInput.getDefaultOptions(), 
        },
      },
    },
    }),
  }),
};
