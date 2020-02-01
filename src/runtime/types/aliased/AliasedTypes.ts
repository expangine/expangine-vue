
import { AliasedType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import Aliased from './Aliased.vue';
import AliasedSettings from './AliasedSettings.vue';


export type AliasedOptions = null;

export const AliasedInput: TypeVisualInput<AliasedType, AliasedOptions> = 
{
  name: 'Aliased',
  description: 'Aliased type',
  input: Aliased,
  settings: AliasedSettings,
  getComplexity: () => 2,
  isVisible: () => false,
  getDefaultOptions: () => null,
  getName: () => '',
  getSummary: () => (
    `<strong>Aliased</strong>`
  ),
};
