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
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof SetExpression
        ? [{ 
            text: 'Transform to Update', 
            description: 'Returns true if value is applied, otherwise false', 
            value: () => new UpdateExpression(expr.path, expr instanceof SetExpression ? expr.value : NoExpression.instance),
          }]
        : []
      ,
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof SetExpression
        ? [{ 
            text: 'Transform to Update', 
            description: 'Set the current value to a value based on the current value',
            value: () => new UpdateExpression(expr.path, expr instanceof SetExpression ? expr.value : NoExpression.instance),
          }]
        : []
      ,
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof SetExpression
        ? [{ 
            text: 'Transform to Update', 
            description: 'Returns true if value is applied, otherwise false', 
            value: () => new UpdateExpression(expr.path, expr instanceof SetExpression ? expr.value : NoExpression.instance),
          }]
        : []
      ,
    },
  },
};
