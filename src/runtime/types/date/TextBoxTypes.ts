
import { DateType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import TextBox from './TextBox.vue';
import TextBoxSettings from './TextBoxSettings.vue';


export interface TextBoxOptions
{
  label: string;
  hint: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  dark: boolean;
  solo: boolean;
  filled: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
}

export const TextBoxInput: TypeVisualInput<DateType, TextBoxOptions> = 
{
  name: 'Textbox',
  description: 'A textbox allows single-line date input',
  input: TextBox,
  settings: TextBoxSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    prefix: '',
    suffix: '',
    placeholder: '',
    counter: false,
    dark: false,
    solo: false,
    filled: false,
    outlined: false,
    dense: false,
    flat: false,
  }),
  getName: (options) => options.label || options.placeholder,
  getSummary: (options) => (
    `<strong>Textbox</strong>: ${options.label}`
  ),
};
