import { Registry } from '../../Registry';

import { DateVisuals, DateBuilder } from '.';


export default function(registry: Registry)
{
  registry
    .addType(DateVisuals)
    .addTypeBuilder(DateBuilder)
  ;
}
