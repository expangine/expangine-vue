
import { TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import TextRadio from './TextRadio.vue';
import TextRadioSettings from './TextRadioSettings.vue';


export interface TextRadioOptions
{
  label?: string;
  items: string[];
  hint?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  singleLine?: boolean;
  dark?: boolean;
  filled?: boolean;
  solo?: boolean;
  outlined?: boolean;
  dense?: boolean;
  flat?: boolean;
  otherLabel: string;
  prependIcon?: string;
  appendIcon?: string;
  offIcon?: string;
  onIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const TextRadioInput: TypeVisualInput<TextType, TextRadioOptions> = 
{
  name: 'Radio',
  description: 'A radio offers a list of options and an "Other" option.',
  input: TextRadio,
  settings: TextRadioSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    items: [],
    otherLabel: 'Other',
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Radio</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
};
