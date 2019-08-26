
import { EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { EnumSubs } from './EnumTypes';
import EnumAutocomplete from './EnumAutocomplete.vue';
import EnumAutocompleteSettings from './EnumAutocompleteSettings.vue';


export interface EnumAutocompleteOptions
{
  label: string;
  hint: string;
  dark: boolean;
  filled: boolean;
  outlined: boolean;
  dense: boolean;
  solo: boolean;
  flat: boolean;
}

export const EnumAutocompleteInput: TypeVisualInput<EnumType, EnumAutocompleteOptions, EnumSubs> = 
{
  name: 'Autocomplete',
  description: 'An autocomplete where the option text is the enum key and the value is the enum value.',
  input: EnumAutocomplete,
  settings: EnumAutocompleteSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    dark: false,
    filled: false,
    outlined: false,
    dense: false,
    solo: false,
    flat: false,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Autocomplete</strong>: ${options.label || options.hint}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
