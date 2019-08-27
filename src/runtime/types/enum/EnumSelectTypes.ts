
import { EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { EnumSubs } from './EnumTypes';
import EnumSelect from './EnumSelect.vue';
import EnumSelectSettings from './EnumSelectSettings.vue';


export interface EnumSelectOptions
{
  label: string;
  hint: string;
  // TODO placeholder
  dark: boolean;
  // TODO singleLine
  filled: boolean;
  outlined: boolean;
  dense: boolean;
  solo: boolean;
  flat: boolean;
}

export const EnumSelectInput: TypeVisualInput<EnumType, EnumSelectOptions, EnumSubs> = 
{
  name: 'Dropdown',
  description: 'A dropdown where the option text is the enum key and the value is the enum value.',
  input: EnumSelect,
  settings: EnumSelectSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    dark: false,
    hint: '',
    filled: false,
    outlined: false,
    dense: false,
    solo: false,
    flat: false,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Dropdown</strong>: ${options.label || options.hint}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
