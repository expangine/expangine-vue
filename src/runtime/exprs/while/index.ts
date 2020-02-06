import { ExpressionVisuals } from '../ExpressionVisuals';
import { WhileExpression, NoExpression, DoExpression } from 'expangine-runtime';

import WhileEditor from './WhileEditor.vue';


export const WhileVisuals: ExpressionVisuals<WhileExpression> =
{
  expr: WhileExpression,
  create: () => new WhileExpression(NoExpression.instance, NoExpression.instance),
  name: 'While',
  description: 'While a condition is true, do an expression',
  describe: ({ registry, expr }) => 'While ' + registry.getExpressionDescribe(expr.condition),
  viewer: WhileEditor,
  editor: WhileEditor,
  complex: true,
  isMultiline: () => true,
  getReturnExpressions: (registry, expr) => registry.getExpressionReturns(expr.body),
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof DoExpression
    ? [{
        text: 'Convert to While',
        description: 'A while checks a condition and while true executes an expression',
        priority: 7,
        value: () => new WhileExpression(expr.condition, expr.body, expr.breakVariable, expr.maxIterations),
      }]
    : []
  ,
};
