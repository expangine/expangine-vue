import { Registry } from '../../Registry';

import { TupleVisuals, TupleBuilder, TupleModifierFromObject, TupleModifierAddType, TupleBuilderWrapper } from '.';


export default function(registry: Registry)
{
  registry
    .addType(TupleVisuals)
    .addTypeBuilder(TupleBuilder)
    .addTypeModifier(TupleModifierFromObject)
    .addTypeModifier(TupleModifierAddType)
    .addTypeBuilderWrapper(TupleBuilderWrapper)
  ;
}
