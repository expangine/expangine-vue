import { ExpressionVisuals } from '../ExpressionVisuals';
import { InvokeExpression } from 'expangine-runtime';

import InvokeEditor from './InvokeEditor.vue';


export const InvokeVisuals: ExpressionVisuals<InvokeExpression> =
{
  expr: InvokeExpression,
  create: () => new InvokeExpression('', {}),
  name: 'Invoke',
  description: 'Execute a user-defined function',
  viewer: InvokeEditor,
  editor: InvokeEditor,
  complex: false,
  isMultiline: () => false,
  isStart: () => true,
  getModifiers: () => [],
};
