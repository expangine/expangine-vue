
import { SetType, EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { SetSubs } from './SetTypes';
import SetEnumCheckbox from './SetEnumCheckbox.vue';
import SetEnumCheckboxSettings from './SetEnumCheckboxSettings.vue';


export interface SetEnumCheckboxOptions
{
  label?: string;
  hint?: string;
  dark?: boolean;
  minWidth: number;
  prependIcon?: string;
  appendIcon?: string;
  offIcon?: string;
  onIcon?: string;
  indeterminateIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const SetEnumCheckboxInput: TypeVisualInput<SetType, SetEnumCheckboxOptions, SetSubs> = 
{
  name: 'Enum Checkboxes',
  description: 'A group of checkboxes where the labels are the enum keys and the values are the enum values.',
  input: SetEnumCheckbox,
  settings: SetEnumCheckboxSettings,
  getComplexity: () => 1,
  isVisible: (type) => type.options.value instanceof EnumType,
  getDefaultOptions: () => ({
    minWidth: 1000,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Enum Checkboxes</strong>: ${options.label || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
