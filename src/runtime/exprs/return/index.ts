
import { ReturnExpression, NoExpression } from 'expangine-runtime';
import { ExpressionVisuals } from '../ExpressionVisuals';

import ReturnEditor from './ReturnEditor.vue';


export const ReturnVisuals: ExpressionVisuals<ReturnExpression> =
{
  expr: ReturnExpression,
  create: (forType) => new ReturnExpression(NoExpression.instance),
  name: 'Return',
  description: 'Return this value immediately',
  viewer: ReturnEditor,
  editor: ReturnEditor,
  complex: false,
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
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
  },
};
