
import { ListType, EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListEnumSelect from './ListEnumSelect.vue';
import ListEnumSelectSettings from './ListEnumSelectSettings.vue';


export interface ListEnumSelectOptions
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
}

export const ListEnumSelectInput: TypeVisualInput<ListType, ListEnumSelectOptions, ListSubs> = 
{
  name: 'Enum Dropdown',
  description: 'A dropdown for an Enum that allows you to select multiple values.',
  hideSubSettings: true,
  input: ListEnumSelect,
  settings: ListEnumSelectSettings,
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
    `<strong>Enum Dropdown</strong>: ${options.label || options.placeholder || options.hint}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
