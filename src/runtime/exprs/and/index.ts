import { ExpressionVisuals } from '../ExpressionVisuals';
import { AndExpression, NoExpression, BooleanType, OrExpression } from 'expangine-runtime';

import AndEditor from './AndEditor.vue';


export const AndVisuals: ExpressionVisuals<AndExpression> =
{
  expr: AndExpression,
  create: (forType) => new AndExpression([]),
  name: 'And',
  description: 'Returns true if all conditions are true',
  viewer: AndEditor,
  editor: AndEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    expr.expressions.some((e) => 
      registry.getExpressionMultiline(e),
    ),
  types: {
    condition: {
      isStart: () => false,
      isValid: () => true,
      getModifiers: (requiredType, expr) => expr.parent instanceof AndExpression
        ? [{
            text: 'And',
            description: 'Add another condition to the And expression',
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
            value: () => new AndExpression([expr, NoExpression.instance]),
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
      getModifiers: (requiredType, expr) => expr.parent instanceof AndExpression
        ? [{
            text: 'And',
            description: 'Add another condition to the And expression',
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
            value: () => new AndExpression([expr, NoExpression.instance]),
          }],
    },
  },
};
