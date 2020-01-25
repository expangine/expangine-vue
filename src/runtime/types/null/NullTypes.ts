
import { NullType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import Null from './Null.vue';
import NullSettings from './NullSettings.vue';


export type NullOptions = null;

export const NullInput: TypeVisualInput<NullType, NullOptions> = 
{
  name: 'Null',
  description: 'Null type',
  input: Null,
  settings: NullSettings,
  getComplexity: () => 2,
  isVisible: () => false,
  getDefaultOptions: () => null,
  getName: () => '',
  getSummary: () => (
    `<strong>Null</strong>`
  ),
};
