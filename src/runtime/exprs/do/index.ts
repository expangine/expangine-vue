import { ExpressionVisuals } from '../ExpressionVisuals';
import { DoExpression, NoExpression } from 'expangine-runtime';

import DoEditor from './DoEditor.vue';


export const DoVisuals: ExpressionVisuals<DoExpression> =
{
  expr: DoExpression,
  create: () => new DoExpression(NoExpression.instance, NoExpression.instance),
  name: 'Do',
  description: 'Do an expression repeatedly while a condition is true',
  viewer: DoEditor,
  editor: DoEditor,
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
    value: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
  },
};
