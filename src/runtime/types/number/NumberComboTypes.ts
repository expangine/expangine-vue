
import { NumberType } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import NumberCombo from './NumberCombo.vue';
import NumberComboSettings from './NumberComboSettings.vue';



export interface NumberComboOptions
{
  label: string;
  items: ListOptions<number>;
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
}

export const NumberComboInput: TypeVisualInput<NumberType, NumberComboOptions> = 
{
  name: 'Combobox',
  description: 'A combobox allows the user to enter a number, optionally from a predefined list.',
  input: NumberCombo,
  settings: NumberComboSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    items: [],
    hint: '',
    prefix: '',
    suffix: '',
    placeholder: '',
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
    `<strong>Combobox</strong>: ${options.label || options.placeholder || options.hint}`
  ),
};
