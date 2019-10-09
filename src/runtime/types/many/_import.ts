import { Registry } from '../../Registry';

import { ManyVisuals, ManyModifier, ManyBuilderWrapper } from '.';


export default function(registry: Registry)
{
  registry
    .addType(ManyVisuals)
    .addTypeModifier(ManyModifier)
    .addTypeBuilderWrapper(ManyBuilderWrapper)
  ;
}
