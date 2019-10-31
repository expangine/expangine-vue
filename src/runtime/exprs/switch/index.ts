import { ExpressionVisuals } from '../ExpressionVisuals';
import { SwitchExpression, NoExpression } from 'expangine-runtime';

import SwitchEditor from './SwitchEditor.vue';


export const SwitchVisuals: ExpressionVisuals<SwitchExpression> =
{
  expr: SwitchExpression,
  create: () => new SwitchExpression(
    NoExpression.instance, // value
    'any:=', // operation
    [ // cases
      [[NoExpression.instance], NoExpression.instance], // initial case
    ], 
    NoExpression.instance, // default case
  ),
  name: 'Switch',
  description: 'If (value) equals (A or B) then (C) if (value) equals (D) then (E) otherwise (F)',
  viewer: SwitchEditor,
  editor: SwitchEditor,
  complex: true,
  isMultiline: () => true,
  isStart: () => true,
  getModifiers: () => [],
};
