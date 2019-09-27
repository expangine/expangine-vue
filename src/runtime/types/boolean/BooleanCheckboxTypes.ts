
import { BooleanType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import BooleanCheckbox from './BooleanCheckbox.vue';
import BooleanCheckboxSettings from './BooleanCheckboxSettings.vue';


export interface BooleanCheckboxOptions
{
  label?: string;
  dark?: boolean;
  hint?: string;
  prependIcon?: string;
  appendIcon?: string;
  offIcon?: string;
  onIcon?: string;
  indeterminateIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const BooleanCheckboxInput: TypeVisualInput<BooleanType, BooleanCheckboxOptions> = 
{
  name: 'Checkbox',
  description: 'A checkbox can be checked (true) or unchecked (false)',
  input: BooleanCheckbox,
  settings: BooleanCheckboxSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Checkbox</strong>: ${options.label || options.hint || ''}`
  ),
};
