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
  complex: false,
  isMultiline: () => false,
  isStart: () => false,
  getModifiers: () => [],
};
