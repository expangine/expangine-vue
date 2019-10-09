import { Registry } from '../../Registry';

import { MapVisuals, MapBuilder, MapModifierFromObject, MapBuilderWrapper } from '.';


export default function(registry: Registry)
{
  registry
    .addType(MapVisuals)
    .addTypeBuilder(MapBuilder)
    .addTypeModifier(MapModifierFromObject)
    .addTypeBuilderWrapper(MapBuilderWrapper)
  ;
}
