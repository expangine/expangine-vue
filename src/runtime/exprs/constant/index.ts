import { ExpressionVisuals } from '../ExpressionVisuals';
import { ConstantExpression, AnyType, SwitchExpression, IfExpression } from 'expangine-runtime';

import ConstantEditor from './ConstantEditor.vue';
import ConstantViewer from './ConstantViewer.vue';


export const ConstantVisuals: ExpressionVisuals<ConstantExpression> =
{
  expr: ConstantExpression,
  create: (forType) => new ConstantExpression(forType ? forType.create() : ''),
  name: 'Constant',
  description: 'A constant value',
  viewer: ConstantViewer,
  editor: ConstantEditor,
  complex: true,
  isMultiline: () => false,
  types: {
    condition: {
      isStart: (requiredType) => !!requiredType && !(requiredType instanceof AnyType),
      isValid: (type, expr, exprType) => type && exprType && type.acceptsType(exprType),
      getModifiers: () => [],
    },
    body: {
      isStart: (requiredType) => true,
      isValid: (requiredType, expr) => !!requiredType || expr.parent instanceof SwitchExpression || expr.parent instanceof IfExpression,
      getModifiers: () => [],
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
  },
};
