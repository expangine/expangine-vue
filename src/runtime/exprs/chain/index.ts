import { ExpressionVisuals } from '../ExpressionVisuals';
import { ChainExpression, NoExpression } from 'expangine-runtime';

import ChainEditor from './ChainEditor.vue';


export const ChainVisuals: ExpressionVisuals<ChainExpression> =
{
  expr: ChainExpression,
  create: (forType) => new ChainExpression([]),
  name: 'Body',
  description: 'Multiple expressions, return the result of the last one',
  viewer: ChainEditor,
  editor: ChainEditor,
  complex: true,
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    body: {
      isStart: () => false,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof ChainExpression
        ? []
        : expr.parent instanceof ChainExpression
          ? [{
              text: 'Insert Expression',
              description: 'Add an expression at this position',
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
              value: () => new ChainExpression([expr]),
            }],
    },
    value: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
  },
};