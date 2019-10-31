import { ExpressionVisuals } from '../ExpressionVisuals';
import { IfExpression, NoExpression } from 'expangine-runtime';

import IfEditor from './IfEditor.vue';


export const IfVisuals: ExpressionVisuals<IfExpression> =
{
  expr: IfExpression,
  create: (forType) => new IfExpression([[NoExpression.instance, NoExpression.instance]], NoExpression.instance),
  name: 'If',
  description: 'If (condition A) then (B) else if (condition C) then (D) else (E)',
  viewer: IfEditor,
  editor: IfEditor,
  complex: true,
  isMultiline: () => true,
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof IfExpression
    ? [{
        text: 'Add Else If',
        description: 'Adds a new condition & body at the end of the If',
        value: () => expr.elseif(NoExpression.instance),
      }]
    : []
  ,
};
