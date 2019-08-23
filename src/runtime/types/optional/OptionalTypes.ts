
import { TextType, OptionalType } from 'expangine-runtime';
import Optional from './Optional.vue';
import OptionalSettings from './OptionalSettings.vue';
import { TypeVisualInput } from '@/runtime/TypeVisuals';


export type OptionalOptions = void;

export type OptionalSubs = 'innerType';

export const OptionalInput: TypeVisualInput<OptionalType, OptionalOptions, OptionalSubs> = 
{
  name: 'Optional',
  description: 'An optional type allows a missing value.',
  input: Optional,
  settings: OptionalSettings,
  isVisible: () => true,
  getDefaultOptions: () => { /**/ },
  getName: () => '',
  getSummary: () => (
    `<strong>Optional</strong>`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
};
