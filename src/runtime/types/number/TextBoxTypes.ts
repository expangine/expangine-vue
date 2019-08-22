
import { TextType } from 'expangine-runtime';
import TextBox from './TextBox.vue';
import TextBoxSettings from './TextBoxSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface TextBoxOptions
{
  label: string;
  hint: string;
  prefix: string;
  suffix: string;
  counter: boolean;
  dark: boolean;
  filled: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
}

export const TextBoxInput: TypeVisualInput<TextType, TextBoxOptions> = 
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
    counter: false,
    dark: false,
    filled: false,
    outlined: false,
    dense: false,
    flat: false,
  }),
  getSummary: (options: TextBoxOptions) => (
    `<strong>Textbox</strong>: ${options.label}`
  ),
};
