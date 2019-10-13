import { ObjectExpression } from 'expangine-runtime';
import { ExpressionVisuals } from '../ExpressionVisuals';

import ObjectEditor from './ObjectEditor.vue';


export const ObjectVisuals: ExpressionVisuals<ObjectExpression> =
{
  expr: ObjectExpression,
  create: (forType) => new ObjectExpression({}),
  name: 'Object',
  description: 'Create a dynamic Object',
  viewer: ObjectEditor,
  editor: ObjectEditor,
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
      isValid: () => true,
      getModifiers: () => [],
    },
  },
};
