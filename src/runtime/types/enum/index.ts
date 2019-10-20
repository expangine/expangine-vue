
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
  describe: ({registry, type}) => 'Enum of ' + registry.getTypeDescribe(type.options.value),
  describeLong: (registry, type, padding, tab, newline) => 
    'Enum {' + newline +
    padding + tab + 'label: ' + registry.getTypeDescribeLong(type.options.key, tab, newline, padding + tab) + newline +
    padding + tab + 'value: ' + registry.getTypeDescribeLong(type.options.value, tab, newline, padding + tab) + newline +
    padding + '}'
  ,
  toString: ({ registry, value, type, tab, newline, padding, process, processInvalid }) => 
    registry.getTypeToString(value, type.options.value, tab, newline, padding, process, processInvalid)
  ,
  subOptions: (registry, type) => registry.getTypeSubOptions(type.options.value),
  subSettings: (registry, type, settings, sub, forKey) => {
    return forKey
      ? settings.sub.key
      : settings.sub.value;
  },
  settingsFor: ({ registry, type, sub }) => ({ 
    input: 'dropdown', 
    defaultValue: registry.getTypeSettings(type.options.value).defaultValue, 
    options: { ...EnumSelectInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub }, 
    sub: { 
      key: registry.getTypeSettings(type.options.key, 'Key'), 
      value: registry.getTypeSettings(type.options.value, 'Value'), 
    },
  }),
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

export const EnumBuilder: TypeBuilder = 
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
