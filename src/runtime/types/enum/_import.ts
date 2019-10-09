import { Registry } from '../../Registry';

import { EnumVisuals, EnumBuilder, EnumBuilderWrapper } from '.';


export default function(registry: Registry)
{
  registry
    .addType(EnumVisuals)
    .addTypeBuilder(EnumBuilder)
    .addTypeBuilderWrapper(EnumBuilderWrapper)
  ;
}
