
import { BooleanType } from 'expangine-runtime';
import BooleanRadio from './BooleanRadio.vue';
import BooleanRadioSettings from './BooleanRadioSettings.vue';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';


export interface BooleanRadioOptions
{
  labelTrue: string;
  labelFalse: string;
  dark?: boolean;
  hint?: string;
  row?: boolean;
  prependIcon?: string;
  appendIcon?: string;
  offIcon?: string;
  onIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const BooleanRadioInput: TypeVisualInput<BooleanType, BooleanRadioOptions> = 
{
  name: 'Radio',
  description: 'A radio has a true and false option',
  input: BooleanRadio,
  settings: BooleanRadioSettings,
  getComplexity: () => 0,
  isVisible: () => true,
  getDefaultOptions: () => ({
    labelTrue: 'True',
    labelFalse: 'False',
  }),
  getName: (options) => (
    `${options.labelTrue} / ${options.labelFalse}`
  ),
  getSummary: (options) => (
    `<strong>Radio</strong>: ${options.labelTrue} / ${options.labelFalse}`
  ),
};
