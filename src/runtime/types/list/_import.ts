import { Registry } from '../../Registry';

import { ListVisuals, ListBuilder, ListBuilderWrapper } from '.';


export default function(registry: Registry)
{
  registry
    .addType(ListVisuals)
    .addTypeBuilder(ListBuilder)
    .addTypeBuilderWrapper(ListBuilderWrapper)
  ;
}
