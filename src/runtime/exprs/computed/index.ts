import { ExpressionVisuals } from '../ExpressionVisuals';
import { ComputedExpression, NoExpression } from 'expangine-runtime';

import ComputedEditor from './ComputedEditor.vue';


export const ComputedVisuals: ExpressionVisuals<ComputedExpression> =
{
  expr: ComputedExpression,
  menu: 'Computed',
  create: () => new ComputedExpression(''),
  name: 'Computed',
  description: 'A computed property of a value',
  describe: ({ registry, expr }) => expr.name.split(':')[1],
  viewer: ComputedEditor,
  editor: ComputedEditor,
  complex: false,
  isMultiline: (registry, expr) => false, // registry.getExpressionMultiline(expr.expression),
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => false,
  getModifiers: () => [],
};
