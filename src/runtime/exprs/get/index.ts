import { ExpressionVisuals } from '../ExpressionVisuals';
import { GetExpression, SetExpression, UpdateExpression } from 'expangine-runtime';

import GetEditor from './GetEditor.vue';
import GetViewer from './GetViewer.vue';


export const GetVisuals: ExpressionVisuals<GetExpression> =
{
  expr: GetExpression,
  create: () => new GetExpression([]),
  name: 'Get',
  description: 'Get a data value',
  describe: ({ registry, expr }) => 'Get ' + expr.path.map((segment) => registry.getExpressionDescribe(segment)).join('->'),
  viewer: GetViewer,
  editor: GetEditor,
  complex: true,
  isMultiline: (registry, expr) => expr.path.some((e) => 
    registry.getExpressionMultiline(e),
  ),
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof SetExpression || expr instanceof UpdateExpression
    ? [{
        text: 'Transform to Get',
        description: 'Get the current value',
        value: () => new GetExpression(expr.path),
      }]
    : []
  ,
};
