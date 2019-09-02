
import { EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { EnumSubs } from './EnumTypes';
import EnumSlider from './EnumSlider.vue';
import EnumSliderSettings from './EnumSliderSettings.vue';


export interface EnumSliderOptions
{
  label?: string;
  hint?: string;
  dark?: boolean;
  filled?: boolean;
  outlined?: boolean;
  dense?: boolean;
  solo?: boolean;
  flat?: boolean;
  prependIcon?: string;
  appendIcon?: string;
  backgroundColor?: string;
  color?: string;
  thumbColor?: string;
  trackColor?: string;
  trackFillColor?: string;
}

export const EnumSliderInput: TypeVisualInput<EnumType, EnumSliderOptions, EnumSubs> = 
{
  name: 'Slider',
  description: 'A slider where the labels are the enum keys and the values are the enum values.',
  input: EnumSlider,
  settings: EnumSliderSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    dark: false,
    filled: false,
    outlined: false,
    dense: false,
    solo: false,
    flat: false,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Slider</strong>: ${options.label || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
