import { ExpressionVisuals } from '../ExpressionVisuals';
import { GetEntityExpression } from 'expangine-runtime';

import EntityEditor from './EntityEditor.vue';


export const GetEntityVisuals: ExpressionVisuals<GetEntityExpression> =
{
  expr: GetEntityExpression,
  create: () => new GetEntityExpression(''),
  name: 'Get Type',
  description: 'Gets a Type',
  describe: ({ registry, expr }) => 'Type ' + expr.name,
  viewer: EntityEditor,
  editor: EntityEditor,
  complex: false,
  isMultiline: () => false,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: () => [],
};
