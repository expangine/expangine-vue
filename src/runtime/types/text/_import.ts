import { Registry } from '../../Registry';

import { TextVisuals, TextBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(TextVisuals)
    .addTypeBuilder(TextBuilder)
  ;
}
