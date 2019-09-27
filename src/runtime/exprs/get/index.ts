import { ExpressionVisuals } from '../ExpressionVisuals';
import { GetExpression } from 'expangine-runtime';

import GetEditor from './GetEditor.vue';
import GetViewer from './GetViewer.vue';


export const GetVisuals: ExpressionVisuals<GetExpression> =
{
  expr: GetExpression,
  create: () => new GetExpression([]),
  name: 'Get',
  description: 'Get a value',
  viewer: GetViewer,
  editor: GetEditor,
  types: {
    condition: {
      isStart: () => true,
      isValid: (type, expr, exprType) => type && exprType && type.isCompatible(exprType),
      getModifiers: () => [],
    },
    body: {
      isStart: () => true,
      isValid: () => false,
      getModifiers: () => [],
    },
    value: {
      isStart: () => true,
      isValid: (type, expr, exprType) => type && exprType && type.isCompatible(exprType),
      getModifiers: () => [],
    },
  },
};
