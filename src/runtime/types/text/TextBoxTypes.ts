
import { TextType } from 'expangine-runtime';
import TextBox from './TextBox.vue';
import TextBoxSettings from './TextBoxSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface TextBoxOptions
{
  label: string;
  type: string;
  hint: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  autocomplete: string;
  singleLine: boolean;
  counter: boolean;
  clearable: boolean;
  dark: boolean;
  filled: boolean;
  solo: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
}

export const TextBoxInput: TypeVisualInput<TextType, TextBoxOptions> = 
{
  name: 'Textbox',
  description: 'A textbox allows single-line plain textual input',
  input: TextBox,
  settings: TextBoxSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    prefix: '',
    suffix: '',
    placeholder: '',
    autocomplete: 'new-password',
    singleLine: false,
    counter: false,
    clearable: false,
    dark: false,
    filled: false,
    solo: false,
    outlined: false,
    dense: false,
    flat: false,
    type: 'text',
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options: TextBoxOptions) => (
    `<strong>Textbox</strong>: ${options.label}`
  ),
};
