
import { ListType, TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import ListCombo from './ListCombo.vue';
import ListComboSettings from './ListComboSettings.vue';


export interface ListComboOptions
{
  label: string;
  items: string[];
  hint: string;
  prefix: string;
  suffix: string;
  placeholder: string;
  chips: boolean;
  smallChips: boolean;
  deletableChips: boolean;
  singleLine: boolean;
  clearable: boolean;
  dark: boolean;
  filled: boolean;
  solo: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
}

export type ListComboSubs = 'item';

export const ListComboInput: TypeVisualInput<ListType, ListComboOptions, ListComboSubs> = 
{
  name: 'Combobox',
  description: 'A combobox allows the user to enter a list of text, with a list of existing values to choose from',
  input: ListCombo,
  settings: ListComboSettings,
  isVisible: (type) => type.options.item instanceof TextType,
  getDefaultOptions: () => ({
    label: '',
    items: [],
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
  getName: (options) => options.label || options.placeholder,
  getSummary: () => (
    `<strong>Combobox</strong>`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
};
