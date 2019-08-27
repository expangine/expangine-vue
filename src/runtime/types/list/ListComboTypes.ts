
import { ListType, TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { ListSubs } from './ListTypes';
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

export const ListComboInput: TypeVisualInput<ListType, ListComboOptions, ListSubs> = 
{
  name: 'Text Combobox',
  description: 'A combobox allows the user to enter a list of text, with a list of existing values to choose from',
  hideSubSettings: true,
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
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Text Combobox</strong>: ${options.label || options.placeholder || options.hint}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
