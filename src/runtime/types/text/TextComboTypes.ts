
import { TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import TextCombo from './TextCombo.vue';
import TextComboSettings from './TextComboSettings.vue';


export interface TextComboOptions
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
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  clearIcon?: string;
  backgroundColor?: string;
  color?: string;
  itemColor?: string;
}

export const TextComboInput: TypeVisualInput<TextType, TextComboOptions> = 
{
  name: 'Combobox',
  description: 'A combobox allows the user to enter text, optionally from a predefined list.',
  input: TextCombo,
  settings: TextComboSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    items: [],
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Combobox</strong>: ${options.label || options.placeholder || options.hint}`
  ),
};
