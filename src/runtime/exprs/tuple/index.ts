import { ExpressionVisuals } from '../ExpressionVisuals';
import { TupleExpression } from 'expangine-runtime';

import TupleEditor from './TupleEditor.vue';


export const TupleVisuals: ExpressionVisuals<TupleExpression> =
{
  expr: TupleExpression,
  create: (forType) => new TupleExpression([]),
  name: 'Tuple',
  description: 'Create a dynamic Tuple',
  describe: ({ registry, expr }) => '[' + expr.expressions.map((element) => registry.getExpressionDescribe(element)).join(', ') + ']',
  viewer: TupleEditor,
  editor: TupleEditor,
  complex: true,
  isMultiline: () => true,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: () => [],
};
