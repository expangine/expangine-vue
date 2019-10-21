
import { ManyType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import Many from './Many.vue';
import ManySettings from './ManySettings.vue';


export type ManyOptions = void;

export type ManySubs = number;

export const ManyInput: TypeVisualInput<ManyType, ManyOptions, ManySubs> = 
{
  name: 'Many',
  description: 'A many type allows a value to be one of many types.',
  input: Many,
  settings: ManySettings,
  getComplexity: ({ type, registry, settings }) => 
    type.options.reduce((max, oneOf, index) => 
      Math.max(max, registry.getTypeVisualInputComplexity(oneOf, settings.sub[index])), 0)
  ,
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
