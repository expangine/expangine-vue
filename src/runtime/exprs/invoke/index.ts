import { ExpressionVisuals } from '../ExpressionVisuals';
import { InvokeExpression, NoExpression } from 'expangine-runtime';

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
  types: {
    condition: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
  },
};
