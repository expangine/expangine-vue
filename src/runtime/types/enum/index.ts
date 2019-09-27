
import { EnumType, TextType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TextBoxInput } from '../text/TextBoxTypes';
import { EnumSelectInput } from './EnumSelectTypes';
import { EnumAutocompleteInput } from './EnumAutocompleteTypes';
import { EnumSliderInput } from './EnumSliderTypes';
import { EnumRadioInput } from './EnumRadioTypes';
import EnumEditor from './EnumEditor.vue';
import EnumOptions from './EnumOptions.vue';
import { initializeSubs } from '@/common';


export const EnumVisuals = createVisuals({
  type: EnumType,
  name: 'Enum',
  description: 'A list of key value pairs.',
  exprs: {
    create: (registry, type) => registry.getCreate(type.options.value),
    valid: (registry, type) => registry.getValid(type.options.value),
    compare: (registry, type) => registry.getCompare(type.options.value),
  },
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
  getOption: ({ registry, existingType, existingSettings }) => ({
    text: 'Enum',
    description: 'A value which is taken from a list of key-value pairs',
    priority: 7,
    value: async () => (initializeSubs(registry, {
      type: new EnumType({ key: new TextType({}), value: existingType || new TextType({}), constants: new Map() }),
      settings: {
      input: 'dropdown',
      defaultValue: '',
      options: EnumSelectInput.getDefaultOptions(),
      sub: { 
        key: { 
          input: 'textbox', 
          defaultValue: '',
          options: TextBoxInput.getDefaultOptions(), 
        },
        value: existingSettings || { 
          input: 'textbox', 
          defaultValue: '',
          options: TextBoxInput.getDefaultOptions(), 
        },
      },
    },
    })),
  }),
};

export const EnumBuilderWrapper: TypeBuilderWrapper =
{
  getOption: ({ registry }) => ({
    text: 'Enum of...',
    priority: 4,
    value: async ([{ type, settings }]) => (initializeSubs(registry, {
      type: new EnumType({ key: new TextType({}), value: type, constants: new Map() }),
      settings: {
        input: 'dropdown',
        defaultValue: settings.defaultValue,
        options: EnumSelectInput.getDefaultOptions(),
        sub: { 
          key: { 
            input: 'textbox', 
            defaultValue: '',
            options: TextBoxInput.getDefaultOptions(), 
          },
          value: settings,
        },
      },
    })),
  }),
};
