
import { DateType } from 'expangine-runtime';
import Picker from './Picker.vue';
import PickerSettings from './PickerSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface PickerOptions
{
  label: string;
  hint: string;
  dark: boolean;
  filled: boolean;
  outlined: boolean;
  dense: boolean;
  flat: boolean;
}

export const PickerInput: TypeVisualInput<DateType, PickerOptions> = 
{
  name: 'Picker',
  description: 'A picker allows the user to select a date.',
  input: Picker,
  settings: PickerSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    dark: false,
    filled: false,
    outlined: false,
    dense: false,
    flat: false,
  }),
  getSummary: (options) => (
    `<strong>Picker</strong>: ${options.label}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
};
