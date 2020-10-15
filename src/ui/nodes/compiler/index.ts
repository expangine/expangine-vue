import { Registry } from '@/runtime/Registry';
import { isArray } from 'expangine-runtime';
import { NodePreview } from '../NodePreview';
import { NodeVisuals } from '../NodeVisuals';
import CompilerEditor from './CompilerEditor.vue';
import CompilerViewer from './CompilerViewer.vue';


export const CompilerVisuals: NodeVisuals = {
  name: 'compiler',
  getPreviews: (registry: Registry) => {
    const out: NodePreview[] = [];

    registry.compilers.forEach((compiler) => {
      compiler.getPreviews(registry).forEach((preview) => {
        out.push(preview);
      });
    });

    return out;
  },
  label: (node, registry) => isArray(node) ? registry.getCompilerLabel(node) : '?',
  isValid: (node, registry) => isArray(node) && !registry.defs.isExpression(node),
  editor: CompilerEditor,
  viewer: CompilerViewer,
};
