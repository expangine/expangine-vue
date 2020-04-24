import { ExpressionVisuals } from '../ExpressionVisuals';
import { ConstantExpression, AnyType, isString, NullType } from 'expangine-runtime';
import { isInPathExpression } from '@/common';
import { getAnyValue } from '@/app/Value';

import ConstantEditor from './ConstantEditor.vue';
import ConstantViewer from './ConstantViewer.vue';


export const ConstantVisuals: ExpressionVisuals<ConstantExpression> =
{
  expr: ConstantExpression,
  menu: 'Constant',
  create: (forType, context, registry) => {
    if (forType instanceof NullType) {
      forType = null;
    }
    const expr = new ConstantExpression(forType ? forType.create() : '');
    getAnyValue(registry, forType).then((value) => {
      expr.value = value;
    });
    return expr;
  },
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
