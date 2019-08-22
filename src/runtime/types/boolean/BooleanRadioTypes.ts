
import { BooleanType } from 'expangine-runtime';
import BooleanRadio from './BooleanRadio.vue';
import BooleanRadioSettings from './BooleanRadioSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface BooleanRadioOptions
{
  labelTrue: string;
  labelFalse: string;
  dark: boolean;
  hint: string;
  row: boolean;
}

export const BooleanRadioInput: TypeVisualInput<BooleanType, BooleanRadioOptions> = 
{
  name: 'Radio',
  description: 'A radio has a true and false option',
  input: BooleanRadio,
  settings: BooleanRadioSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    labelTrue: '',
    labelFalse: '',
    dark: false,
    hint: '',
    row: false,
  }),
  getSummary: (options) => (
    `<strong>Radio</strong>: ${options.labelTrue} / ${options.labelFalse}`
  ),
};
