
import { ListType, EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListEnumSelect from './ListEnumSelect.vue';
import ListEnumSelectSettings from './ListEnumSelectSettings.vue';


export interface ListEnumSelectOptions
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

export const ListEnumSelectInput: TypeVisualInput<ListType, ListEnumSelectOptions, ListSubs> = 
{
  name: 'Enum Dropdown',
  description: 'A dropdown for an Enum that allows you to select multiple values.',
  hideSubSettings: true,
  input: ListEnumSelect,
  settings: ListEnumSelectSettings,
  isVisible: (type) => type.options.item instanceof EnumType,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Enum Dropdown</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
