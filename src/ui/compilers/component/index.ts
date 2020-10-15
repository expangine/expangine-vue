import { NodePreview } from '@/ui/nodes/NodePreview';
import { objectEach } from 'expangine-runtime';
import { COMPILER_COMPONENT, ComponentRegistry } from 'expangine-ui';
import { CompilerVisuals } from '../CompilerVisuals';
import { Documentation } from '../../Documentation';
import ComponentViewer from './ComponentViewer.vue';


export const ComponentVisuals: CompilerVisuals = {
  name: COMPILER_COMPONENT,
  getPreviews: (registry) => {
    const out: NodePreview[] = [];
    
    objectEach(ComponentRegistry, (component) => {
      const id = `${component.collection}/${component.name}`;
      const doc = Documentation.components[id];

      if (doc) {
        out.push({
          folders: [component.collection, doc.category],
          name: component.name,
          description: doc.description,
          template: doc.template || [id],
          preview: doc.preview || [id],
        });
      } else {
        out.push({
          folders: [component.collection],
          name: component.name,
          description: '',
          template: [id],
          preview: ['bulma/button', { fullWidth: true }, {}, [component.name]],
        });
      }
    });

    return out;
  },
  label: ([tag]) => tag as string,
  editor: null as any,
  viewer: ComponentViewer,
};
