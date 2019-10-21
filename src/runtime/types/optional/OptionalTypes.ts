
import { OptionalType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import Optional from './Optional.vue';
import OptionalSettings from './OptionalSettings.vue';


export interface OptionalOptions
{
  removeIcon?: string;
  removeLabel?: string;
}

export type OptionalSubs = 'innerType';

export const OptionalInput: TypeVisualInput<OptionalType, OptionalOptions, OptionalSubs> = 
{
  name: 'Optional',
  description: 'An optional type allows a missing value.',
  input: Optional,
  settings: OptionalSettings,
  getComplexity: ({ type, registry, settings }) => 
    registry.getTypeVisualInputComplexity(type.options, settings.sub.innerType)
  ,
  isVisible: () => true,
  getDefaultOptions: () => ({}),
  getName: () => '',
  getSummary: () => (
    `<strong>Optional</strong>`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
