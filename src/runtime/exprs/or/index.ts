import { ExpressionVisuals, ExpressionModifierCallback } from '../ExpressionVisuals';
import { OrExpression, NoExpression, AndExpression, Expression } from 'expangine-runtime';

import OrEditor from './OrEditor.vue';
import { ListOptions } from '@/common';


export const OrVisuals: ExpressionVisuals<OrExpression> =
{
  expr: OrExpression,
  create: () => new OrExpression([]),
  name: 'Or',
  description: 'Returns true if any of the conditions are true',
  viewer: OrEditor,
  editor: OrEditor,
  isMultiline: (registry, expr) => 
    expr.expressions.some((e) => 
      registry.getExpressionMultiline(e),
    ),
  types: {
    condition: {
      isStart: () => false,
      isValid: () => true,
      getModifiers: (requiredType, expr) => expr.parent instanceof OrExpression
        ? [{
            text: 'Or',
            description: 'Add another condition to the Or expression',
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
            value: () => new OrExpression([expr, NoExpression.instance]),
          }],
    },
    body: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    value: {
      isStart: () => false,
      isValid: () => true,
      getModifiers: (requiredType, expr) => expr.parent instanceof OrExpression
        ? [{
            text: 'Or',
            description: 'Add another condition to the Or expression',
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
            value: () => new OrExpression([expr, NoExpression.instance]),
          }],
    },
  },
};
