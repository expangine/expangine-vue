
import { NumberType } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import NumberBitDropdown from './NumberBitDropdown.vue';
import NumberBitDropdownSettings from './NumberBitDropdownSettings.vue';



export interface NumberBitDropdownOptions
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
  smallChips?: boolean;
  deletableChips?: boolean;
  chips?: boolean;
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  clearIcon?: string;
  backgroundColor?: string;
  color?: string;
  itemColor?: string;
}

export const NumberBitDropdownInput: TypeVisualInput<NumberType, NumberBitDropdownOptions> = 
{
  name: 'Bitmask Dropdown',
  description: 'A dropdown allows the user to select multiple power-of-2 values to produce a number.',
  input: NumberBitDropdown,
  settings: NumberBitDropdownSettings,
  getComplexity: () => 0,
  isVisible: () => true,
  getDefaultOptions: () => ({
    items: [],
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Combobox</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
};
