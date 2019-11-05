import { ExpressionVisuals } from '../ExpressionVisuals';
import { ConstantExpression, AnyType, isString } from 'expangine-runtime';
import { isInPathExpression } from '@/common';

import ConstantEditor from './ConstantEditor.vue';
import ConstantViewer from './ConstantViewer.vue';


export const ConstantVisuals: ExpressionVisuals<ConstantExpression> =
{
  expr: ConstantExpression,
  create: (forType) => new ConstantExpression(forType ? forType.create() : ''),
  name: 'Constant',
  description: 'A constant value',
  describe: ({ registry, expr }) => isString(expr.value) && isInPathExpression(expr) ? expr.value : JSON.stringify(AnyType.baseType.toJson(expr.value)),
  viewer: ConstantViewer,
  editor: ConstantEditor,
  complex: true,
  isMultiline: () => false,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: () => [],
};
