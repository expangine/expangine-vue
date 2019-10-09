import { Registry } from '../../Registry';

import { NumberVisuals, NumberBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(NumberVisuals)
    .addTypeBuilder(NumberBuilder)
  ;
}
