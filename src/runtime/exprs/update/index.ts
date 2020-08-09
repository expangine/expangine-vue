import { ExpressionVisuals } from '../ExpressionVisuals';
import { UpdateExpression, NoExpression, GetExpression, SetExpression, PathExpression } from 'expangine-runtime';

import UpdateEditor from './UpdateEditor.vue';
import UpdateViewer from './UpdateViewer.vue';


export const UpdateVisuals: ExpressionVisuals<UpdateExpression> =
{
  expr: UpdateExpression,
  menu: 'Update',
  create: () => new UpdateExpression(new PathExpression([NoExpression.instance]), NoExpression.instance),
  name: 'Update',
  description: 'Set a value based on the current value',
  describe: ({ registry, expr }) => 'Update ' + expr.path.expressions.map((segment) => registry.getExpressionDescribe(segment)).join('->') + ' = ' + registry.getExpressionDescribe(expr.value),
  viewer: UpdateViewer,
  editor: UpdateEditor,
  complex: true,
  isMultiline: (registry, expr) => false, 
    // registry.getExpressionMultiline(expr.value),
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof PathExpression || expr instanceof SetExpression
    ? [{ 
        text: 'Transform to Update', 
        description: 'Returns true if value is applied, otherwise false', 
        priority: 9,
        value: () => expr instanceof PathExpression
          ? new UpdateExpression(expr, NoExpression.instance)
          : new UpdateExpression(expr.path, expr.value),
      }]
    : []
  ,
};
