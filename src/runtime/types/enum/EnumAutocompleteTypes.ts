
import { EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { EnumSubs } from './EnumTypes';
import EnumAutocomplete from './EnumAutocomplete.vue';
import EnumAutocompleteSettings from './EnumAutocompleteSettings.vue';


export interface EnumAutocompleteOptions
{
  label?: string;
  hint?: string;
  dark?: boolean;
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

export const EnumAutocompleteInput: TypeVisualInput<EnumType, EnumAutocompleteOptions, EnumSubs> = 
{
  name: 'Autocomplete',
  description: 'An autocomplete where the option text is the enum key and the value is the enum value.',
  input: EnumAutocomplete,
  settings: EnumAutocompleteSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Autocomplete</strong>: ${options.label || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
