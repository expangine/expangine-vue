
import { DateType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import DateTextBox from './DateTextBox.vue';
import DateTextBoxSettings from './DateTextBoxSettings.vue';


export interface DateTextBoxOptions
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
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  clearIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const DateTextBoxInput: TypeVisualInput<DateType, DateTextBoxOptions> = 
{
  name: 'Textbox',
  description: 'A textbox allows single-line date input',
  input: DateTextBox,
  settings: DateTextBoxSettings,
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
    prependInnerIcon: 'mdi-calendar',
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Textbox</strong>: ${options.label}`
  ),
};
