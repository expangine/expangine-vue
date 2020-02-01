import { Registry } from '../../Registry';

import { AliasedVisuals, AliasedModifier } from '.';


export default function(registry: Registry)
{
  registry
    .addType(AliasedVisuals)
    .addTypeModifier(AliasedModifier)
  ;
}
