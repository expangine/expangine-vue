import { ExpressionVisuals, ExpressionModifierCallback } from '../ExpressionVisuals';
import { SubExpression, NoExpression, Expression, Type, GetExpression, ComputedExpression } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';
import { ListOptionsPriority } from '@/common';

import SubEditor from './SubEditor.vue';


export const SubVisuals: ExpressionVisuals<SubExpression> =
{
  expr: SubExpression,
  create: () => new SubExpression(NoExpression.instance, []),
  name: 'Sub',
  description: 'A sub-property of a value',
  describe: ({ registry, expr }) => registry.getExpressionDescribe(expr.value) + ' -> ' + expr.path.map((segment) => registry.getExpressionDescribe(segment)).join(' -> '),
  viewer: SubEditor,
  editor: SubEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    registry.getExpressionMultiline(expr.value) || 
    expr.path.some((e) => 
      registry.getExpressionMultiline(e),
    )
  ,
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => false,
  getModifiers,
};

function getModifiers(requiredType: Type | null, expr: Expression, exprType: Type | null, registry: Registry): ListOptionsPriority<ExpressionModifierCallback>
{
  if (expr instanceof GetExpression 
   || expr instanceof SubExpression
   || expr instanceof ComputedExpression
   || !exprType
   || (exprType.getSubTypes(registry.defs).length === 0) && registry.defs.getComputedsFor(exprType).length === 0)
  {
    return [];
  }

  return [{
    text: 'Sub Property',
    description: 'Get a sub property of the current value',
    priority: 6,
    value: () => new SubExpression(expr, []),
  }];
}
