import { ExpressionVisuals } from '../ExpressionVisuals';
import { IfExpression, NoExpression } from 'expangine-runtime';

import IfEditor from './IfEditor.vue';


export const IfVisuals: ExpressionVisuals<IfExpression> =
{
  expr: IfExpression,
  create: (forType) => new IfExpression([[NoExpression.instance, NoExpression.instance]], NoExpression.instance),
  name: 'If',
  description: 'If (condition) then (this) else (that)',
  viewer: IfEditor,
  editor: IfEditor,
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: (type, expr) => expr instanceof IfExpression
        ? [{
            text: 'Add Else If',
            value: () => expr.elseif(NoExpression.instance),
          }]
        : [],
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof IfExpression
        ? [{
            text: 'Add Else If',
            value: () => expr.elseif(NoExpression.instance),
          }]
        : [],
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof IfExpression
        ? [{
            text: 'Add Else If',
            value: () => expr.elseif(NoExpression.instance),
          }]
        : [],
    },
  },
};
