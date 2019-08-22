
import { BooleanType } from 'expangine-runtime';
import BooleanCheckbox from './BooleanCheckbox.vue';
import BooleanCheckboxSettings from './BooleanCheckboxSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface BooleanCheckboxOptions
{
  label: string;
  dark: boolean;
  hint: string;
}

export const BooleanCheckboxInput: TypeVisualInput<BooleanType, BooleanCheckboxOptions> = 
{
  name: 'Checkbox',
  description: 'A checkbox can be checked (true) or unchecked (false)',
  input: BooleanCheckbox,
  settings: BooleanCheckboxSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    dark: false,
    hint: '',
  }),
  getSummary: (options) => (
    `<strong>Checkbox</strong>: ${options.label}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
};
