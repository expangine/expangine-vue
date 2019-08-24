
import { NumberType } from 'expangine-runtime';
import TextBox from './TextBox.vue';
import TextBoxSettings from './TextBoxSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface TextBoxOptions
{
  label: string;
  hint: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  dark: boolean;
  filled: boolean;
  solo: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
}

export const TextBoxInput: TypeVisualInput<NumberType, TextBoxOptions> = 
{
  name: 'Textbox',
  description: 'A textbox allows single-line number input',
  input: TextBox,
  settings: TextBoxSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    prefix: '',
    suffix: '',
    placeholder: '',
    dark: false,
    filled: false,
    solo: false,
    outlined: false,
    dense: false,
    flat: false,
  }),
  getName: (options) => options.label,
  getSummary: (options: TextBoxOptions) => (
    `<strong>Textbox</strong>: ${options.label}`
  ),
};
