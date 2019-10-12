import { Registry } from '../../Registry';

import { AnyVisuals, AnyBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(AnyVisuals)
    .addTypeBuilder(AnyBuilder)
  ;
}
