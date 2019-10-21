
import { ColorType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import Picker from './ColorPicker.vue';
import PickerSettings from './ColorPickerSettings.vue';


export interface ColorPickerOptions
{
  label?: string;
  hint?: string;
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
  showSwatches?: boolean;
  mode?: 'rgba' | 'hsla' | 'hexa';
  hideCanvas?: boolean;
  hideModeSwitch?: boolean;
  hideInputs?: boolean;
}

export const ColorPickerInput: TypeVisualInput<ColorType, ColorPickerOptions> = 
{
  name: 'Picker',
  description: 'A picker allows the user to select a color.',
  input: Picker,
  settings: PickerSettings,
  getComplexity: () => 0,
  isVisible: () => true,
  getDefaultOptions: () => ({
    appendIcon: 'mdi-format-color-fill',
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Picker</strong>: ${options.label || options.hint || ''}`
  ),
};
