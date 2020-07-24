import { ExpressionVisuals } from '../ExpressionVisuals';
import { MethodExpression } from 'expangine-runtime';

import MethodEditor from './MethodEditor.vue';


export const MethodVisuals: ExpressionVisuals<MethodExpression> =
{
  expr: MethodExpression,
  menu: 'Method',
  create: () => new MethodExpression('', '', {}),
  name: 'Method',
  description: 'Execute a method on a type',
  describe: ({ registry, expr }) => 'Method ' + expr.name,
  viewer: MethodEditor,
  editor: MethodEditor,
  complex: false,
  isMultiline: () => false,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: () => [],
};
