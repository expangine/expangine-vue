import { Registry } from '../../Registry';

import { AliasedVisuals, AliasedModifier, AliasedBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(AliasedVisuals)
    .addTypeBuilder(AliasedBuilder)
    .addTypeModifier(AliasedModifier)
  ;
}
