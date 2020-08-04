
import { ListType, EntityType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListEntityAutocmplete from './ListEntityAutocomplete.vue';
import ListEntityAutocompleteSettings from './ListEntityAutocompleteSettings.vue';


export interface ListEntityAutocompleteOptions
{
  label?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  singleLine?: boolean;
  clearable?: boolean;
  smallChips?: boolean;
  deletableChips?: boolean;
  chips?: boolean;
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

export const ListEntityAutocompleteInput: TypeVisualInput<ListType, ListEntityAutocompleteOptions, ListSubs> = 
{
  name: 'Autocomplete',
  description: 'An autocomplete for a Type that allows you to select multiple instances.',
  hideSubSettings: true,
  input: ListEntityAutocmplete,
  settings: ListEntityAutocompleteSettings,
  getComplexity: () => 0,
  isVisible: (type) => type.options.item instanceof EntityType,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Autocomplete</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
