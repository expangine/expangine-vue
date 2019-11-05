import { ExpressionVisuals } from '../ExpressionVisuals';
import { SwitchExpression, NoExpression, Expression } from 'expangine-runtime';

import SwitchEditor from './SwitchEditor.vue';


export const SwitchVisuals: ExpressionVisuals<SwitchExpression> =
{
  expr: SwitchExpression,
  create: () => new SwitchExpression(
    NoExpression.instance, // value
    'any:=', // operation
    [ // cases
      [[NoExpression.instance], NoExpression.instance], // initial case
    ], 
    NoExpression.instance, // default case
  ),
  name: 'Switch',
  description: 'If (value) equals (A or B) then (C) if (value) equals (D) then (E) otherwise (F)',
  describe: ({ registry, expr }) => 'Switch ' + registry.getExpressionDescribe(expr.value),
  viewer: SwitchEditor,
  editor: SwitchEditor,
  complex: true,
  isMultiline: () => true,
  getReturnExpressions: (registry, expr) => {
    const returns: Expression[] = [];

    expr.cases.forEach(([tests, value]) => {
      returns.push(...registry.getExpressionReturns(value));
    });

    if (expr.defaultCase !== NoExpression.instance) {
      returns.push(...registry.getExpressionReturns(expr.defaultCase));
    }

    return returns;
  },
  isStart: () => true,
  getModifiers: () => [],
};
