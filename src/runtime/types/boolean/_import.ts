import { Registry } from '../../Registry';

import { BooleanVisuals, BooleanBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(BooleanVisuals)
    .addTypeBuilder(BooleanBuilder)
  ;
}
