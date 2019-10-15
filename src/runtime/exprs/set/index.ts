import { ExpressionVisuals } from '../ExpressionVisuals';
import { SetExpression, NoExpression, GetExpression, UpdateExpression } from 'expangine-runtime';

import SetEditor from './SetEditor.vue';
import SetViewer from './SetViewer.vue';


export const SetVisuals: ExpressionVisuals<SetExpression> =
{
  expr: SetExpression,
  create: () => new SetExpression([], NoExpression.instance),
  name: 'Set',
  description: 'Set a data value',
  viewer: SetViewer,
  editor: SetEditor,
  complex: true,
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof UpdateExpression
        ? [{ 
            text: 'Transform to Set', 
            description: 'Returns true if value is applied, otherwise false', 
            value: () => new SetExpression(expr.path, NoExpression.instance),
          }]
        : []
      ,
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof UpdateExpression
        ? [{ 
            text: 'Transform to Set', 
            description: 'Set the current value to a new value',
            value: () => new SetExpression(expr.path, NoExpression.instance),
          }]
        : []
      ,
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof UpdateExpression
        ? [{ 
            text: 'Transform to Set', 
            description: 'Returns true if value is applied, otherwise false', 
            value: () => new SetExpression(expr.path, NoExpression.instance),
          }]
        : []
      ,
    },
  },
};