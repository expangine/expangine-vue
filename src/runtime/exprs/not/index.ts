import { ExpressionVisuals } from '../ExpressionVisuals';
import { NotExpression, NoExpression } from 'expangine-runtime';

import NotEditor from './NotEditor.vue';


export const NotVisuals: ExpressionVisuals<NotExpression> =
{
  expr: NotExpression,
  create: (forType) => new NotExpression(NoExpression.instance),
  name: 'Not',
  description: 'Negates the following expression',
  viewer: NotEditor,
  editor: NotEditor,
  complex: false,
  isMultiline: (registry, expr) => registry.getExpressionMultiline(expr.expression),
  isStart: () => false,
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
      }]
  ,
};
