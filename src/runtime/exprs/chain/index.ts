import { ExpressionVisuals } from '../ExpressionVisuals';
import { ChainExpression, NoExpression } from 'expangine-runtime';

import ChainEditor from './ChainEditor.vue';


export const ChainVisuals: ExpressionVisuals<ChainExpression> =
{
  expr: ChainExpression,
  menu: 'Body',
  create: (forType) => new ChainExpression([]),
  name: 'Body',
  description: 'Multiple expressions, return the result of the last one',
  describe: ({ registry, expr }) => 'Body ' + registry.getExpressionDescribe(expr.chain[0]) + ' + ' + (expr.chain.length - 1) + ' more',
  viewer: ChainEditor,
  editor: ChainEditor,
  complex: true,
  isMultiline: () => false, // true
  isStart: () => false,
  getReturnExpressions: (registry, expr) => registry.getExpressionReturns(expr.chain[expr.chain.length - 1]),
  getModifiers: (type, expr) => expr instanceof ChainExpression
    ? []
    : expr.parent instanceof ChainExpression
      ? [{
          text: 'Insert Expression',
          description: 'Add an expression at this position',
          priority: 4.25,
          value: () => {
            if (expr.parent instanceof ChainExpression) {
              const i = expr.parent.chain.indexOf(expr);
              expr.parent.chain.splice(i, 0, NoExpression.instance);
            }
            return expr;
          },
        }, {
          text: 'Add Expression',
          description: 'Add an expression after this expression',
          priority: 4,
          value: () => {
            if (expr.parent instanceof ChainExpression) {
              const i = expr.parent.chain.indexOf(expr);
              expr.parent.chain.splice(i + 1, 0, NoExpression.instance);
            }
            return expr;
          },
        }]
      : [{
          text: 'Add Expression',
          description: 'Add an expression after this expression',
          priority: 1,
          value: () => new ChainExpression([expr]),
        }]
  ,
};
