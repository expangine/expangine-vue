
import { ManyType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import Many from './Many.vue';
import ManySettings from './ManySettings.vue';


export type ManyOptions = void;

export type ManySubs = string;

export const ManyInput: TypeVisualInput<ManyType, ManyOptions, ManySubs> = 
{
  name: 'Many',
  description: 'A many type allows a value to be one of many types.',
  input: Many,
  settings: ManySettings,
  isVisible: () => true,
  getDefaultOptions: () => { /**/ },
  getName: () => '',
  getSummary: () => (
    `<strong>Many</strong>`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
