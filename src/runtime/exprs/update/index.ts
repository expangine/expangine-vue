import { ExpressionVisuals } from '../ExpressionVisuals';
import { UpdateExpression, NoExpression, GetExpression, SetExpression } from 'expangine-runtime';

import UpdateEditor from './UpdateEditor.vue';
import UpdateViewer from './UpdateViewer.vue';


export const UpdateVisuals: ExpressionVisuals<UpdateExpression> =
{
  expr: UpdateExpression,
  create: () => new UpdateExpression([], NoExpression.instance),
  name: 'Update',
  description: 'Set a value based on the current value',
  viewer: UpdateViewer,
  editor: UpdateEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    registry.getExpressionMultiline(expr.value)
  ,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof SetExpression
    ? [{ 
        text: 'Transform to Update', 
        description: 'Returns true if value is applied, otherwise false', 
        value: () => new UpdateExpression(expr.path, expr instanceof SetExpression ? expr.value : NoExpression.instance),
      }]
    : []
  ,
};
