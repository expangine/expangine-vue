
import { EnumType, TextType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { EnumSelectInput } from './EnumSelectTypes';
import { TextBoxInput } from '../text/TextBoxTypes';
import { EnumSubs } from './EnumTypes';
import EnumEditor from './EnumEditor.vue';


const EnumVisuals: TypeVisuals<EnumType, true, false, EnumSubs> =
{
  type: EnumType,
  newInstance: () => new EnumType({ key: new TextType({}), value: new TextType({}), constants: new Map() }),
  name: 'Enum',
  description: 'A list of key value pairs.',
  editor: EnumEditor,
  buildable: true,
  buildLabel: 'Enum',
  onBuild: async () => ({
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
  defaultInput: 'dropdown',
  inputsOrder: ['dropdown'],
  inputs: {
    dropdown: EnumSelectInput,
  },
};

export default EnumVisuals;
