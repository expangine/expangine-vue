import { ExpressionVisuals } from '../ExpressionVisuals';
import { ConstantExpression, AnyType } from 'expangine-runtime';

import ConstantEditor from './ConstantEditor.vue';
import ConstantViewer from './ConstantViewer.vue';


export const ConstantVisuals: ExpressionVisuals<ConstantExpression> =
{
  expr: ConstantExpression,
  create: (forType) => new ConstantExpression(forType ? forType.create() : null),
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
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    value: {
      isStart: (requiredType) => !!requiredType && !(requiredType instanceof AnyType),
      isValid: () => true,
      getModifiers: () => [],
    },
  },
};
