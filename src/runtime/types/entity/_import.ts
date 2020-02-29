import { Registry } from '../../Registry';

import { EntityVisuals, EntityModifier } from '.';


export default function(registry: Registry)
{
  registry
    .addType(EntityVisuals)
    .addTypeModifier(EntityModifier)
  ;
}
