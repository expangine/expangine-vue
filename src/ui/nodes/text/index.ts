import { Registry } from '@/runtime/Registry';
import { isString } from 'expangine-runtime';
import { NodeVisuals } from '../NodeVisuals';
import TextEditor from './TextEditor.vue';
import TextViewer from './TextViewer.vue';


export const TextVisuals: NodeVisuals = {
  name: 'text',
  getPreviews: (registry: Registry) => [{
    name: 'Text',
    description: 'Plain text',
    template: '',
    preview: ['div', {}, {}, ['Text']],
  }],
  label: () => 'text',
  isValid: (node) => isString(node),
  editor: TextEditor,
  viewer: TextViewer,
};
