import { ExpressionVisuals } from '../ExpressionVisuals';
import { OrExpression, NoExpression } from 'expangine-runtime';

import OrEditor from './OrEditor.vue';


export const OrVisuals: ExpressionVisuals<OrExpression> =
{
  expr: OrExpression,
  create: () => new OrExpression([]),
  name: 'Or',
  description: 'Returns true if any of the conditions are true',
  describe: ({ registry, expr }) => 'Or (' + registry.getExpressionDescribe(expr.expressions[0]) + ') + ' + (expr.expressions.length - 1) + ' more',
  viewer: OrEditor,
  editor: OrEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    expr.expressions.some((e) => 
      registry.getExpressionMultiline(e),
    )
  ,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => false,
  getModifiers: (requiredType, expr) => expr.parent instanceof OrExpression
    ? [{
        text: 'Or',
        description: 'Add another condition to the Or expression',
        priority: 5,
        value: () => {
          if (expr.parent instanceof OrExpression) {
            expr.parent.expressions.push(NoExpression.instance);
          }
          return expr;
        },
      }]
    : [{
        text: 'Or',
        description: 'Create an Or expression with the (current) AND (another)',
        priority: 5,
        value: () => new OrExpression([expr, NoExpression.instance]),
      }]
  ,
};
