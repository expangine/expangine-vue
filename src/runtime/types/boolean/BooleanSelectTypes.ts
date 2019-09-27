
import { BooleanType } from 'expangine-runtime';
import BooleanSelect from './BooleanSelect.vue';
import BooleanSelectSettings from './BooleanSelectSettings.vue';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';


export interface BooleanSelectOptions
{
  label?: string;
  labelTrue: string;
  labelFalse: string;
  dark?: boolean;
  hint?: string;
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

export const BooleanSelectInput: TypeVisualInput<BooleanType, BooleanSelectOptions> = 
{
  name: 'Dropdown',
  description: 'A dropdown has a true and false option',
  input: BooleanSelect,
  settings: BooleanSelectSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    labelTrue: 'True',
    labelFalse: 'False',
  }),
  getName: (options) => (
    `${options.labelTrue} / ${options.labelFalse}`
  ),
  getSummary: (options) => (
    `<strong>Dropdown</strong>: ${options.label || ''} ${options.labelTrue} / ${options.labelFalse}`
  ),
};
