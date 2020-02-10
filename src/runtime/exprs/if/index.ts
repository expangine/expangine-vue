import { ExpressionVisuals } from '../ExpressionVisuals';
import { IfExpression, NoExpression, Expression } from 'expangine-runtime';

import IfEditor from './IfEditor.vue';


export const IfVisuals: ExpressionVisuals<IfExpression> =
{
  expr: IfExpression,
  create: (forType) => new IfExpression([[NoExpression.instance, NoExpression.instance]], NoExpression.instance),
  name: 'If',
  description: 'If (condition A) then (B) else if (condition C) then (D) else (E)',
  describe: ({ registry, expr }) => 'If ' + registry.getExpressionDescribe(expr.cases[0][0]),
  viewer: IfEditor,
  editor: IfEditor,
  complex: true,
  isMultiline: () => false, // true,
  getReturnExpressions: (registry, expr) => {
    const returns: Expression[] = [];

    expr.cases.forEach(([test, value]) => {
      returns.push(...registry.getExpressionReturns(value));
    });

    if (expr.otherwise !== NoExpression.instance) {
      returns.push(...registry.getExpressionReturns(expr.otherwise));
    }

    return returns;
  },
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof IfExpression
    ? [{
        text: 'Add Else If',
        description: 'Adds a new condition & body at the end of the If',
        priority: 1,
        value: () => expr.elseif(NoExpression.instance),
      }]
    : []
  ,
};
