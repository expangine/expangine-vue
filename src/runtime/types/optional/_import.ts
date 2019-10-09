import { Registry } from '../../Registry';

import { OptionalVisuals, OptionalModifier, OptionalModifierRequire } from '.';


export default function(registry: Registry)
{
  registry
    .addType(OptionalVisuals)
    .addTypeModifier(OptionalModifier)
    .addTypeModifier(OptionalModifierRequire)
  ;
}
