import { ExpressionVisuals } from '../ExpressionVisuals';
import { ForExpression, NoExpression, ObjectType } from 'expangine-runtime';

import ForEditor from './ForEditor.vue';


export const ForVisuals: ExpressionVisuals<ForExpression> =
{
  expr: ForExpression,
  menu: 'For',
  create: (forType, context) => new ForExpression(
    ['i', 'k', 'j', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'w']
      .find((v) => context instanceof ObjectType 
        ? context.options.props[v]
           ? false
           : true
        : true) || 'i', 
    NoExpression.instance, 
    NoExpression.instance, 
    NoExpression.instance,
  ),
  name: 'For',
  description: 'Execute an expression a number of times',
  describe: ({ registry, expr }) => 'For ' + expr.variable + ' = (' + registry.getExpressionDescribe(expr.start) + '), ' + expr.variable + ' < (' + registry.getExpressionDescribe(expr.end) + ')',
  viewer: ForEditor,
  editor: ForEditor,
  complex: true,
  isMultiline: () => false, // true
  getReturnExpressions: (registry, expr) => registry.getExpressionReturns(expr.body),
  isStart: () => true,
  getModifiers: () => [],
};
