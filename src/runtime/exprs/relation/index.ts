import { ExpressionVisuals } from '../ExpressionVisuals';
import { GetRelationExpression } from 'expangine-runtime';

import RelationEditor from './RelationEditor.vue';


export const GetRelationVisuals: ExpressionVisuals<GetRelationExpression> =
{
  expr: GetRelationExpression,
  create: () => new GetRelationExpression(''),
  name: 'Get Relation',
  description: 'Gets a Relation',
  describe: ({ registry, expr }) => 'Relation ' + expr.name,
  viewer: RelationEditor,
  editor: RelationEditor,
  complex: false,
  isMultiline: () => false,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: () => [],
};
