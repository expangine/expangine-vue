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
  describe: ({ registry, expr }) => 'Set ' + expr.path.map((segment) => registry.getExpressionDescribe(segment)).join('->') + ' = ' + registry.getExpressionDescribe(expr.value),
  viewer: SetViewer,
  editor: SetEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    registry.getExpressionMultiline(expr.value)
  ,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof GetExpression || expr instanceof UpdateExpression
    ? [{ 
        text: 'Transform to Set', 
        description: 'Set the current value to a new value',
        value: () => new SetExpression(expr.path, NoExpression.instance),
      }]
    : []
  ,
};
