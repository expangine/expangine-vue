import { ExpressionVisuals } from '../ExpressionVisuals';
import { NotExpression, NoExpression } from 'expangine-runtime';

import NotEditor from './NotEditor.vue';


export const NotVisuals: ExpressionVisuals<NotExpression> =
{
  expr: NotExpression,
  create: (forType) => new NotExpression(NoExpression.instance),
  name: 'Not',
  description: 'Negates the following expression',
  describe: ({ registry, expr }) => 'Not ' + registry.getExpressionDescribe(expr.expression),
  viewer: NotEditor,
  editor: NotEditor,
  complex: false,
  isMultiline: (registry, expr) => false, // registry.getExpressionMultiline(expr.expression),
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => false,
  getModifiers: (requiredType, expr) => expr instanceof NotExpression
    ? [{
        text: 'Remove Not',
        description: 'Remove the negation and keep the inner expression',
        priority: 1,
        value: () => expr.expression,
      }]
    : [{
        text: 'Not',
        description: 'The value is negated, a truthy value is made false, and falsy values are made true',
        priority: 5,
        value: () => new NotExpression(expr),
      }]
  ,
};
