import { ExpressionVisuals } from '../ExpressionVisuals';
import { NoExpression } from 'expangine-runtime';

import NoEditor from './NoEditor.vue';


export const NoVisuals: ExpressionVisuals<NoExpression> =
{
  expr: NoExpression,
  create: (forType) => NoExpression.instance,
  name: 'No',
  description: 'No expression',
  viewer: NoEditor,
  editor: NoEditor,
  isMultiline: () => false,
  types: {
    condition: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    body: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    value: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
  },
};
