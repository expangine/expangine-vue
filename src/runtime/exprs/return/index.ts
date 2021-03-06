
import { ReturnExpression, NoExpression } from 'expangine-runtime';
import { ExpressionVisuals } from '../ExpressionVisuals';

import ReturnEditor from './ReturnEditor.vue';


export const ReturnVisuals: ExpressionVisuals<ReturnExpression> =
{
  expr: ReturnExpression,
  menu: 'Return',
  create: (forType) => new ReturnExpression(NoExpression.instance),
  name: 'Return',
  description: 'Return this value immediately',
  describe: ({ registry, expr }) => 'Return ' + registry.getExpressionDescribe(expr.value),
  viewer: ReturnEditor,
  editor: ReturnEditor,
  complex: false,
  isMultiline: () => false, // true,
  getReturnExpressions: (registry, expr) => registry.getExpressionReturns(expr.value),
  isStart: () => true,
  getModifiers: (requiredType, expr) => requiredType
    ? []
    : expr instanceof ReturnExpression
      ? [{
          text: 'Remove Return',
          description: 'Remove the return expression',
          priority: 1,
          value: () => expr.value,
        }]
      : [{
          text: 'Return',
          description: 'Return this expression as the function result',
          priority: 7,
          value: () => new ReturnExpression(expr),
        }]
  ,
};
