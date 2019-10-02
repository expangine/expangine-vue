import { ExpressionVisuals } from '../ExpressionVisuals';
import { WhileExpression, NoExpression, DoExpression } from 'expangine-runtime';

import WhileEditor from './WhileEditor.vue';


export const WhileVisuals: ExpressionVisuals<WhileExpression> =
{
  expr: WhileExpression,
  create: () => new WhileExpression(NoExpression.instance, NoExpression.instance),
  name: 'While',
  description: 'While a condition is true, do an expression',
  viewer: WhileEditor,
  editor: WhileEditor,
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
      getModifiers: (type, expr) => expr instanceof DoExpression
        ? [{
            text: 'Convert to While',
            description: 'A while checks a condition and while true executes an expression',
            value: () => new WhileExpression(expr.condition, expr.body, expr.breakVariable, expr.maxIterations),
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
