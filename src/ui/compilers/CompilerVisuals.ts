import { Registry } from '@/runtime/Registry';
import { NodeTemplate } from 'expangine-ui';
import { VueConstructor } from 'vue';
import { NodePreview } from '../nodes/NodePreview';


export interface CompilerVisuals
{
  name: string;
  getPreviews: (registry: Registry) => NodePreview[];
  label: (node: NodeTemplate, registry: Registry) => string;
  editor: VueConstructor;
  viewer: VueConstructor;
}
