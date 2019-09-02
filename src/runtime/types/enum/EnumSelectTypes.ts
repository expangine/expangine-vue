
import { EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { EnumSubs } from './EnumTypes';
import EnumSelect from './EnumSelect.vue';
import EnumSelectSettings from './EnumSelectSettings.vue';


export interface EnumSelectOptions
{
  label?: string;
  hint?: string;
  dark?: boolean;
  placeholder?: string;
  singleLine?: boolean;
  filled?: boolean;
  outlined?: boolean;
  dense?: boolean;
  solo?: boolean;
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

export const EnumSelectInput: TypeVisualInput<EnumType, EnumSelectOptions, EnumSubs> = 
{
  name: 'Dropdown',
  description: 'A dropdown where the option text is the enum key and the value is the enum value.',
  input: EnumSelect,
  settings: EnumSelectSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.hint || options.placeholder,
  getSummary: (options) => (
    `<strong>Dropdown</strong>: ${options.label || options.hint || options.placeholder || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
