import { Registry } from '../../Registry';

import { ColorVisuals, ColorBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(ColorVisuals)
    .addTypeBuilder(ColorBuilder)
  ;
}
