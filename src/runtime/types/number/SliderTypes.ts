
import { NumberType, isNumber } from 'expangine-runtime';
import Slider from './Slider.vue';
import SliderSettings from './SliderSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface SliderOptions
{
  label: string;
  hint: string;
  dark: boolean;
  step: number;
  thumbLabel: boolean;
}

export const SliderInput: TypeVisualInput<NumberType, SliderOptions> = 
{
  name: 'Slider',
  description: 'A slider specifies a number value.',
  input: Slider,
  settings: SliderSettings,
  isVisible: (type) => isNumber(type.options.min) && isNumber(type.options.max),
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    dark: false,
    step: 1,
    thumbLabel: false,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options: SliderOptions) => (
    `<strong>Slider</strong>: ${options.label}`
  ),
};
