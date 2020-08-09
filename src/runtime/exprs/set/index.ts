import { ExpressionVisuals } from '../ExpressionVisuals';
import { SetExpression, NoExpression, GetExpression, UpdateExpression, PathExpression } from 'expangine-runtime';

import SetEditor from './SetEditor.vue';
import SetViewer from './SetViewer.vue';


export const SetVisuals: ExpressionVisuals<SetExpression> =
{
  expr: SetExpression,
  menu: 'Set',
  create: () => new SetExpression(new PathExpression([NoExpression.instance]), NoExpression.instance),
  name: 'Set',
  description: 'Set a data value',
  describe: ({ registry, expr }) => 'Set ' + expr.path.expressions.map((segment) => registry.getExpressionDescribe(segment)).join('->') + ' = ' + registry.getExpressionDescribe(expr.value),
  viewer: SetViewer,
  editor: SetEditor,
  complex: true,
  isMultiline: (registry, expr) => false,
    // registry.getExpressionMultiline(expr.value),
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof PathExpression || expr instanceof UpdateExpression
    ? [{ 
        text: 'Transform to Set', 
        description: 'Set the current value to a new value',
        priority: 9,
        value: () => expr instanceof PathExpression
          ? new SetExpression(expr, NoExpression.instance)
          : new SetExpression(expr.path, expr.value),
      }]
    : []
  ,
};
