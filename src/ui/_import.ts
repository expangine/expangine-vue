import { Registry } from '@/runtime/Registry';
import NodeImports from './nodes/_import';
import CompilerImports from './compilers/_import';


export default function(registry: Registry)
{
  NodeImports(registry);
  CompilerImports(registry);
}
