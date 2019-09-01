
import { ListType, EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListEnumAutocomplete from './ListEnumAutocomplete.vue';
import ListEnumAutocompleteSettings from './ListEnumAutocompleteSettings.vue';


export interface ListEnumAutocompleteOptions
{
  label: string;
  hint: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  singleLine: boolean;
  clearable: boolean;
  smallChips: boolean;
  deletableChips: boolean;
  chips: boolean;
  dark: boolean;
  filled: boolean;
  solo: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendOuterIcon?: string;
  clearIcon?: string;
  backgroundColor?: string;
  color?: string;
  itemColor?: string;
}

export const ListEnumAutocompleteInput: TypeVisualInput<ListType, ListEnumAutocompleteOptions, ListSubs> = 
{
  name: 'Enum Autocomplete',
  description: 'An autocomplete for an Enum that allows you to select multiple values.',
  hideSubSettings: true,
  input: ListEnumAutocomplete,
  settings: ListEnumAutocompleteSettings,
  isVisible: (type) => type.options.item instanceof EnumType,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    prefix: '',
    suffix: '',
    placeholder: '',
    chips: true,
    smallChips: false,
    deletableChips: false,
    singleLine: false,
    clearable: false,
    dark: false,
    filled: false,
    solo: false,
    outlined: false,
    dense: false,
    flat: false,
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Enum Autocomplete</strong>: ${options.label || options.placeholder || options.hint}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
