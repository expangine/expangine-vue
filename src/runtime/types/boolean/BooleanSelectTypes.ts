
import { BooleanType } from 'expangine-runtime';
import BooleanSelect from './BooleanSelect.vue';
import BooleanSelectSettings from './BooleanSelectSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface BooleanSelectOptions
{
  label: string;
  labelTrue: string;
  labelFalse: string;
  dark: boolean;
  hint: string;
  filled: boolean;
  outlined: boolean;
  dense: boolean;
  solo: boolean;
  flat: boolean;
}

export const BooleanSelectInput: TypeVisualInput<BooleanType, BooleanSelectOptions> = 
{
  name: 'Dropdown',
  description: 'A dropdown has a true and false option',
  input: BooleanSelect,
  settings: BooleanSelectSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    labelTrue: '',
    labelFalse: '',
    dark: false,
    hint: '',
    filled: false,
    outlined: false,
    dense: false,
    solo: false,
    flat: false,
  }),
  getName: (options) => (
    `${options.labelTrue} / ${options.labelFalse}`
  ),
  getSummary: (options) => (
    `<strong>Dropdown</strong>: ${options.label} ${options.labelTrue} / ${options.labelFalse}`
  ),
};
