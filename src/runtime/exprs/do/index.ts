import { ExpressionVisuals } from '../ExpressionVisuals';
import { DoExpression, NoExpression, WhileExpression } from 'expangine-runtime';

import DoEditor from './DoEditor.vue';


export const DoVisuals: ExpressionVisuals<DoExpression> =
{
  expr: DoExpression,
  create: () => new DoExpression(NoExpression.instance, NoExpression.instance),
  name: 'Do',
  description: 'Do an expression repeatedly while a condition is true',
  describe: ({ registry, expr }) => 'Do While ' + registry.getExpressionDescribe(expr.condition),
  viewer: DoEditor,
  editor: DoEditor,
  complex: true,
  isMultiline: () => true,
  getReturnExpressions: (registry, expr) => registry.getExpressionReturns(expr.body),
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof WhileExpression
    ? [{
        text: 'Convert to Do',
        description: 'A Do executes the expression and continues if the condition is true',
        value: () => new DoExpression(expr.condition, expr.body, expr.breakVariable, expr.maxIterations),
      }]
    : [],
};
