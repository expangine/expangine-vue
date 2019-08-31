
import { TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import TextRadio from './TextRadio.vue';
import TextRadioSettings from './TextRadioSettings.vue';


export interface TextRadioOptions
{
  label: string;
  items: string[];
  hint: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  singleLine: boolean;
  dark: boolean;
  filled: boolean;
  solo: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
  otherLabel: string;
}

export const TextRadioInput: TypeVisualInput<TextType, TextRadioOptions> = 
{
  name: 'Radio',
  description: 'A radio offers a list of options and an "Other" option.',
  input: TextRadio,
  settings: TextRadioSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    items: [],
    hint: '',
    prefix: '',
    suffix: '',
    placeholder: '',
    otherLabel: 'Other',
    singleLine: false,
    dark: false,
    filled: false,
    solo: false,
    outlined: false,
    dense: false,
    flat: false,
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Radio</strong>: ${options.label || options.placeholder || options.hint}`
  ),
};
