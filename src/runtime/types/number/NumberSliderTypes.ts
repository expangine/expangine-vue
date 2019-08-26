
import { NumberType, isNumber } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import NumberSlider from './NumberSlider.vue';
import NumberSliderSettings from './NumberSliderSettings.vue';


export interface NumberSliderOptions
{
  label: string;
  hint: string;
  dark: boolean;
  step: number;
  thumbLabel: boolean;
}

export const NumberSliderInput: TypeVisualInput<NumberType, NumberSliderOptions> = 
{
  name: 'Slider',
  description: 'A slider specifies a number value.',
  input: NumberSlider,
  settings: NumberSliderSettings,
  isVisible: (type) => isNumber(type.options.min) && isNumber(type.options.max),
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    dark: false,
    step: 1,
    thumbLabel: false,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Slider</strong>: ${options.label || options.hint}`
  ),
};
