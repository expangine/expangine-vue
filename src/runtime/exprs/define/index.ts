import { DefineExpression, NoExpression } from 'expangine-runtime';
import { ExpressionVisuals } from '../ExpressionVisuals';
import { obj } from '@/common';

import DefineEditor from './DefineEditor.vue';


export const DefineVisuals: ExpressionVisuals<DefineExpression> =
{
  expr: DefineExpression,
  create: (forType) => new DefineExpression(obj(), NoExpression.instance),
  name: 'Define',
  description: 'Define variables to use later',
  viewer: DefineEditor,
  editor: DefineEditor,
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
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
  },
};
