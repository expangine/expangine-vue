
import { SetType, EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { SetSubs } from './SetTypes';
import SetEnumSelect from './SetEnumSelect.vue';
import SetEnumSelectSettings from './SetEnumSelectSettings.vue';


export interface SetEnumSelectOptions
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

export const SetEnumSelectInput: TypeVisualInput<SetType, SetEnumSelectOptions, SetSubs> = 
{
  name: 'Enum Dropdown',
  description: 'A dropdown for an Enum that allows you to select multiple values.',
  hideSubSettings: true,
  input: SetEnumSelect,
  settings: SetEnumSelectSettings,
  getComplexity: () => 0,
  isVisible: (type) => type.options.value instanceof EnumType,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.placeholder || options.hint,
  getSummary: (options) => (
    `<strong>Enum Dropdown</strong>: ${options.label || options.placeholder || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
