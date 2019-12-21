import { Registry } from '../../Registry';

import { SetVisuals, SetBuilder, SetBuilderWrapper, SetModifierFromSimpleList } from '.';


export default function(registry: Registry)
{
  registry
    .addType(SetVisuals)
    .addTypeBuilder(SetBuilder)
    .addTypeBuilderWrapper(SetBuilderWrapper)
    .addTypeModifier(SetModifierFromSimpleList)
  ;
}
