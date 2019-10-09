import { Registry } from '../../Registry';

import { ObjectVisuals, ObjectBuilder, ObjectModifierToObject } from '.';


export default function(registry: Registry)
{
  registry
    .addType(ObjectVisuals)
    .addTypeBuilder(ObjectBuilder)
    .addTypeModifier(ObjectModifierToObject)
  ;
}
