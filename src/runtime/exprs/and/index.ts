import { ExpressionVisuals } from '../ExpressionVisuals';
import { AndExpression, NoExpression } from 'expangine-runtime';

import AndEditor from './AndEditor.vue';


export const AndVisuals: ExpressionVisuals<AndExpression> =
{
  expr: AndExpression,
  create: (forType) => new AndExpression([]),
  name: 'And',
  description: 'Returns true if all conditions are true',
  describe: ({ registry, expr }) => 'And (' + registry.getExpressionDescribe(expr.expressions[0]) + ') + ' + (expr.expressions.length - 1) + ' more',
  viewer: AndEditor,
  editor: AndEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    expr.expressions.some((e) => 
      registry.getExpressionMultiline(e),
    )
  ,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => false,
  getModifiers: (requiredType, expr) => expr.parent instanceof AndExpression
    ? [{
        text: 'And',
        description: 'Add another condition to the And expression',
        priority: 1,
        value: () => {
          if (expr.parent instanceof AndExpression) {
            expr.parent.expressions.push(NoExpression.instance);
          }
          return expr;
        },
      }]
    : [{
        text: 'And',
        description: 'Create an And expression with the (current) AND (another)',
        priority: 4.5,
        value: () => new AndExpression([expr, NoExpression.instance]),
      }]
  ,
};
