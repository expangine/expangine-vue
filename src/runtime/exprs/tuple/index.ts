import { ExpressionVisuals } from '../ExpressionVisuals';
import { TupleExpression } from 'expangine-runtime';

import TupleEditor from './TupleEditor.vue';


export const TupleVisuals: ExpressionVisuals<TupleExpression> =
{
  expr: TupleExpression,
  create: (forType) => new TupleExpression([]),
  name: 'Tuple',
  description: 'Create a dynamic Tuple',
  viewer: TupleEditor,
  editor: TupleEditor,
  complex: true,
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
    value: {
      isStart: () => true,
      isValid: () => false,
      getModifiers: () => [],
    },
  },
};
