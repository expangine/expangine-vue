
import { AnyType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import Any from './Any.vue';
import AnySettings from './AnySettings.vue';


export interface AnyOptions
{
  designLabel?: string;
}

export const AnyInput: TypeVisualInput<AnyType, AnyOptions> = 
{
  name: 'Any',
  description: 'Any type and value.',
  input: Any,
  settings: AnySettings,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: () => '',
  getSummary: () => (
    `<strong>Any</strong>`
  ),
};
