import { ExpressionVisuals } from '../ExpressionVisuals';
import { PathExpression } from 'expangine-runtime';

import PathEditor from './PathEditor.vue';
import PathViewer from './PathViewer.vue';


export const PathVisuals: ExpressionVisuals<PathExpression> =
{
  expr: PathExpression,
  create: (forType) => new PathExpression([]),
  name: 'Path',
  menu: 'Path',
  description: 'Returns true if all conditions are true',
  describe: ({ registry, expr }) => expr.expressions.map((segment) => registry.getExpressionDescribe(segment)).join(' -> '),
  viewer: PathViewer,
  editor: PathEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    expr.expressions.some((e) => 
      registry.getExpressionMultiline(e),
    )
  ,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => false,
  getModifiers: (requiredType, expr) => [],
};
