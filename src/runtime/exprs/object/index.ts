import { ObjectExpression, objectValues } from 'expangine-runtime';
import { ExpressionVisuals } from '../ExpressionVisuals';

import ObjectEditor from './ObjectEditor.vue';


export const ObjectVisuals: ExpressionVisuals<ObjectExpression> =
{
  expr: ObjectExpression,
  create: (forType) => new ObjectExpression({}),
  name: 'Object',
  description: 'Create a dynamic Object',
  describe: ({ registry, expr }) => '{ ' + objectValues(expr.props, (_, key) => key).join(', ') + ' }',
  viewer: ObjectEditor,
  editor: ObjectEditor,
  complex: true,
  isMultiline: () => false, // true,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: () => [],
};
