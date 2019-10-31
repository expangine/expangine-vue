
import { ReturnExpression, NoExpression } from 'expangine-runtime';
import { ExpressionVisuals } from '../ExpressionVisuals';

import ReturnEditor from './ReturnEditor.vue';


export const ReturnVisuals: ExpressionVisuals<ReturnExpression> =
{
  expr: ReturnExpression,
  create: (forType) => new ReturnExpression(NoExpression.instance),
  name: 'Return',
  description: 'Return this value immediately',
  viewer: ReturnEditor,
  editor: ReturnEditor,
  complex: false,
  isMultiline: () => true,
  isStart: () => true,
  getModifiers: (requiredType, expr) => requiredType
    ? []
    : expr instanceof ReturnExpression
      ? [{
          text: 'Remove Return',
          description: 'Remove the return expression',
          value: () => expr.value,
        }]
      : [{
          text: 'Return',
          description: 'Return this expression as the function result',
          value: () => new ReturnExpression(expr),
        }]
  ,
};
