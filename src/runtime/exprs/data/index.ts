import { ExpressionVisuals } from '../ExpressionVisuals';
import { GetDataExpression } from 'expangine-runtime';

import DataEditor from './DataEditor.vue';


export const GetDataVisuals: ExpressionVisuals<GetDataExpression> =
{
  expr: GetDataExpression,
  create: () => new GetDataExpression(''),
  name: 'Get Data',
  description: 'Gets user-defined Data',
  describe: ({ registry, expr }) => 'Data ' + expr.name,
  viewer: DataEditor,
  editor: DataEditor,
  complex: false,
  isMultiline: () => false,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: () => [],
};
