
import { TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import TextBox from './TextBox.vue';
import TextBoxSettings from './TextBoxSettings.vue';


export interface TextBoxOptions
{
  label?: string;
  type?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  autocomplete?: string;
  singleLine?: boolean;
  counter?: boolean;
  clearable?: boolean;
  dark?: boolean;
  filled?: boolean;
  solo?: boolean;
  outlined?: boolean;
  dense?: boolean;
  flat?: boolean;
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  clearIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const TextBoxInput: TypeVisualInput<TextType, TextBoxOptions> = 
{
  name: 'Textbox',
  description: 'A textbox allows single-line plain textual input',
  input: TextBox,
  settings: TextBoxSettings,
  getComplexity: () => 0,
  isVisible: () => true,
  getDefaultOptions: () => ({
    autocomplete: 'new-password',
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options: TextBoxOptions) => (
    `<strong>Textbox</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
};
