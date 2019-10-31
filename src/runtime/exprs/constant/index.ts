import { ExpressionVisuals } from '../ExpressionVisuals';
import { ConstantExpression } from 'expangine-runtime';

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
  isStart: () => true,
  getModifiers: () => [],
};
