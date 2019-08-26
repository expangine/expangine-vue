
import { NumberType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import NumberTextBox from './NumberTextBox.vue';
import NumberTextBoxSettings from './NumberTextBoxSettings.vue';


export interface NumberTextBoxOptions
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

export const NumberTextBoxInput: TypeVisualInput<NumberType, NumberTextBoxOptions> = 
{
  name: 'Textbox',
  description: 'A textbox allows single-line number input',
  input: NumberTextBox,
  settings: NumberTextBoxSettings,
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
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Textbox</strong>: ${options.label || options.placeholder || options.hint}`
  ),
};
