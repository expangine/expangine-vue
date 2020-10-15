import { Registry } from '@/runtime/Registry';
import { DefaultVisuals } from './default';
import { ComponentVisuals } from './component';
import { ForVisuals } from './for';
import { IfVisuals } from './if';
import { SwitchVisuals } from './switch';


export default function(registry: Registry)
{
  registry
    .addCompiler(IfVisuals)
    .addCompiler(SwitchVisuals)
    .addCompiler(ForVisuals)
    .addCompiler(DefaultVisuals)
    .addCompiler(ComponentVisuals)
  ;
}
