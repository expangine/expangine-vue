import { ExpressionVisuals } from '../ExpressionVisuals';
import { DoExpression, NoExpression, WhileExpression } from 'expangine-runtime';

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
      getModifiers: (type, expr) => expr instanceof WhileExpression
        ? [{
            text: 'Convert to Do',
            description: 'A Do executes the expression and continues if the condition is true',
            value: () => new DoExpression(expr.condition, expr.body, expr.breakVariable, expr.maxIterations),
          }]
        : [],
    },
    value: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
  },
};
