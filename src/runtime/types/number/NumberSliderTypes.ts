
import { NumberType, isNumber } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import NumberSlider from './NumberSlider.vue';
import NumberSliderSettings from './NumberSliderSettings.vue';


export interface NumberSliderOptions
{
  label?: string;
  hint?: string;
  dark?: boolean;
  step?: number;
  thumbLabel?: boolean;
  prependIcon?: string;
  appendIcon?: string;
  backgroundColor?: string;
  color?: string;
  thumbColor?: string;
  trackColor?: string;
  trackFillColor?: string;
}

export const NumberSliderInput: TypeVisualInput<NumberType, NumberSliderOptions> = 
{
  name: 'Slider',
  description: 'A slider specifies a number value.',
  input: NumberSlider,
  settings: NumberSliderSettings,
  isVisible: (type) => isNumber(type.options.min) && isNumber(type.options.max),
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Slider</strong>: ${options.label || options.hint || ''}`
  ),
};
