
import { TextType } from 'expangine-runtime';
import TextArea from './TextArea.vue';
import TextAreaSettings from './TextAreaSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface TextAreaOptions
{
  label: string;
  hint: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  rows: number;
  rowHeight: number;
  autocomplete: string;
  autoGrow: boolean;
  counter: boolean;
  clearable: boolean;
  dark: boolean;
  filled: boolean;
  solo: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
}

export const TextAreaInput: TypeVisualInput<TextType, TextAreaOptions> = 
{
  name: 'Textarea',
  description: 'A textarea allows multi-line plain textual input',
  input: TextArea,
  settings: TextAreaSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    prefix: '',
    suffix: '',
    placeholder: '',
    rows: 5,
    autocomplete: 'new-password',
    autoGrow: false,
    rowHeight: 24,
    counter: false,
    clearable: false,
    dark: false,
    filled: false,
    solo: false,
    outlined: false,
    dense: false,
    flat: false,
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Textarea</strong>: ${options.label}`
  ),
};
