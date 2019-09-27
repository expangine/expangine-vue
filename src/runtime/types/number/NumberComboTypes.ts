
import { NumberType } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import NumberCombo from './NumberCombo.vue';
import NumberComboSettings from './NumberComboSettings.vue';



export interface NumberComboOptions
{
  label?: string;
  items: ListOptions<number>;
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

export const NumberComboInput: TypeVisualInput<NumberType, NumberComboOptions> = 
{
  name: 'Combobox',
  description: 'A combobox allows the user to enter a number, optionally from a predefined list.',
  input: NumberCombo,
  settings: NumberComboSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    items: [],
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Combobox</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
};
