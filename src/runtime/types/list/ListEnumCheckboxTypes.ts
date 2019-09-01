
import { ListType, EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListEnumCheckbox from './ListEnumCheckbox.vue';
import ListEnumCheckboxSettings from './ListEnumCheckboxSettings.vue';


export interface ListEnumCheckboxOptions
{
  label: string;
  hint: string;
  dark: boolean;
  minWidth: number;
  prependIcon?: string;
  appendIcon?: string;
  offIcon?: string;
  onIcon?: string;
  indeterminateIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const ListEnumCheckboxInput: TypeVisualInput<ListType, ListEnumCheckboxOptions, ListSubs> = 
{
  name: 'Enum Checkboxes',
  description: 'A group of checkboxes where the labels are the enum keys and the values are the enum values.',
  input: ListEnumCheckbox,
  settings: ListEnumCheckboxSettings,
  isVisible: (type) => type.options.item instanceof EnumType,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    dark: false,
    minWidth: 1000,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Enum Checkboxes</strong>: ${options.label || options.hint}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
