
import { EntityType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import Entity from './Entity.vue';
import EntitySettings from './EntitySettings.vue';


export type EntityOptions = null;

export const EntityInput: TypeVisualInput<EntityType, EntityOptions> = 
{
  name: 'Entity',
  description: 'Entity type',
  input: Entity,
  settings: EntitySettings,
  getComplexity: () => 2,
  isVisible: () => false,
  getDefaultOptions: () => null,
  getName: () => '',
  getSummary: () => (
    `<strong>Entity</strong>`
  ),
};
