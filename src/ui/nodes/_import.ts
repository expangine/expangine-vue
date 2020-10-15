import { Registry } from '@/runtime/Registry';
import { CompilerVisuals } from './compiler';
import { ExpressionVisuals } from './expression';
import { TextVisuals } from './text';


export default function(registry: Registry)
{
  registry
    .addNode(TextVisuals)
    .addNode(ExpressionVisuals)
    .addNode(CompilerVisuals)
  ;
}
