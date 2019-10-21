
import { EnumType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { EnumSubs } from './EnumTypes';
import EnumRadio from './EnumRadio.vue';
import EnumRadioSettings from './EnumRadioSettings.vue';


export interface EnumRadioOptions
{
  label?: string;
  hint?: string;
  dark?: boolean;
  row?: boolean;
  prependIcon?: string;
  appendIcon?: string;
  offIcon?: string;
  onIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const EnumRadioInput: TypeVisualInput<EnumType, EnumRadioOptions, EnumSubs> = 
{
  name: 'Radio',
  description: 'A group of radio where the labels are the enum keys and the values are the enum values.',
  input: EnumRadio,
  settings: EnumRadioSettings,
  getComplexity: () => 1,
  isVisible: () => true,
  getDefaultOptions: () => ({
    label: '',
    hint: '',
    dark: false,
    row: false,
  }),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Radio</strong>: ${options.label || options.hint || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
