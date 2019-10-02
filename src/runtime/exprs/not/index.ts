import { ExpressionVisuals } from '../ExpressionVisuals';
import { NotExpression, NoExpression, BooleanType } from 'expangine-runtime';

import NotEditor from './NotEditor.vue';


export const NotVisuals: ExpressionVisuals<NotExpression> =
{
  expr: NotExpression,
  create: (forType) => new NotExpression(NoExpression.instance),
  name: 'Not',
  description: 'Negates the following expression',
  viewer: NotEditor,
  editor: NotEditor,
  isMultiline: (registry, expr) => registry.getExpressionMultiline(expr.expression),
  types: {
    condition: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: (requiredType, expr) => expr instanceof NotExpression
        ? [{
            text: 'Remove Not',
            description: 'Remove the negation and keep the inner expression',
            value: () => expr.expression,
          }]
        : [{
            text: 'Not',
            description: 'The value is negated, a truthy value is made false, and falsy values are made true',
            value: () => new NotExpression(expr),
          }],
    },
    body: {
      isStart: () => false,
      isValid: () => true,
      getModifiers: () => [],
    },
    value: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: (requiredType, expr, exprType) => 
            requiredType 
          && exprType
          && BooleanType.baseType.isCompatible(requiredType)
          && BooleanType.baseType.isCompatible(exprType)
          ? [{
              text: 'Negate',
              description: 'The value is negated, a truthy value is made false, and falsy values are made true',
              value: () => new NotExpression(expr),
            }]
          : [],
    },
  },
};
