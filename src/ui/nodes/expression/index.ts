import { NoExpression } from 'expangine-runtime';
import { NodeVisuals } from '../NodeVisuals';
import ExpressionEditor from './ExpressionEditor.vue';
import ExpressionViewer from './ExpressionViewer.vue';


export const ExpressionVisuals: NodeVisuals = {
  name: 'expression',
  getPreviews: () => [{
    name: 'Expression',
    description: 'An expression which returns text',
    template: NoExpression.instance,
    preview: ['div', {}, {}, ['Expression']],
  }],
  label: () => 'expression',
  isValid: (node, registry) => registry.defs.isExpression(node),
  editor: ExpressionEditor,
  viewer: ExpressionViewer,
};
