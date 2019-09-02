
import { BooleanType } from 'expangine-runtime';
import BooleanSwitch from './BooleanSwitch.vue';
import BooleanSwitchSettings from './BooleanSwitchSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export interface BooleanSwitchOptions
{
  label?: string;
  dark?: boolean;
  hint?: string;
  inset?: boolean;
  prependIcon?: string;
  appendIcon?: string;
  backgroundColor?: string;
  color?: string;
}

export const BooleanSwitchInput: TypeVisualInput<BooleanType, BooleanSwitchOptions> = 
{
  name: 'Switch',
  description: 'A switch can be on (true) or off (false)',
  input: BooleanSwitch,
  settings: BooleanSwitchSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: (options) => options.label || options.hint,
  getSummary: (options) => (
    `<strong>Switch</strong>: ${options.label}`
  ),
};
