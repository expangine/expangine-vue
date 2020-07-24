import { ExpressionVisuals } from '../ExpressionVisuals';
import { GetExpression, SetExpression, UpdateExpression, Exprs } from 'expangine-runtime';

import GetEditor from './GetEditor.vue';
import GetViewer from './GetViewer.vue';


export const GetVisuals: ExpressionVisuals<GetExpression> =
{
  expr: GetExpression,
  menu: 'Get',
  create: () => Exprs.path(Exprs.get()),
  name: 'Get',
  description: 'Get a data value',
  describe: ({ registry, expr }) => 'Get',
  viewer: GetViewer,
  editor: GetEditor,
  complex: true,
  isMultiline: (registry, expr) => false, // expr.path.some((e) =>  registry.getExpressionMultiline(e)),
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: (type, expr) => expr instanceof SetExpression || expr instanceof UpdateExpression
    ? [{
        text: 'Transform to Get',
        description: 'Get the current value',
        priority: 9,
        value: () => expr.path.clone(),
      }]
    : []
  ,
};
