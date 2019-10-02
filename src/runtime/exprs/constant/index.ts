import { ExpressionVisuals } from '../ExpressionVisuals';
import { ConstantExpression } from 'expangine-runtime';

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
  isMultiline: () => false,
  types: {
    condition: {
      isStart: () => true,
      isValid: (type, expr, exprType) => type && exprType && type.isCompatible(exprType),
      getModifiers: () => [],
    },
    body: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
  },
};
