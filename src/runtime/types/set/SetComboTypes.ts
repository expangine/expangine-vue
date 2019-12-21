
import { SetType, TextType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { SetSubs } from './SetTypes';
import SetCombo from './SetCombo.vue';
import SetComboSettings from './SetComboSettings.vue';


export interface SetComboOptions
{
  label?: string;
  items?: string[];
  hint?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  chips?: boolean;
  smallChips?: boolean;
  deletableChips?: boolean;
  singleLine?: boolean;
  clearable?: boolean;
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

export const SetComboInput: TypeVisualInput<SetType, SetComboOptions, SetSubs> = 
{
  name: 'Text Combobox',
  description: 'A combobox allows the user to enter a list of text, with a list of existing values to choose from',
  hideSubSettings: true,
  input: SetCombo,
  settings: SetComboSettings,
  getComplexity: () => 0,
  isVisible: (type) => type.options.value instanceof TextType,
  getDefaultOptions: () => ({
    items: [],
  }),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Text Combobox</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
