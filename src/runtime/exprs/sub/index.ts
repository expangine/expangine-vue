import { ExpressionVisuals, ExpressionModifierCallback } from '../ExpressionVisuals';
import { SubExpression, NoExpression, Expression, Type, GetExpression } from 'expangine-runtime';
import { Registry } from '@/runtime/Registry';
import { ListOptions } from '@/common';

import SubEditor from './SubEditor.vue';


export const SubVisuals: ExpressionVisuals<SubExpression> =
{
  expr: SubExpression,
  create: () => new SubExpression(NoExpression.instance, []),
  name: 'Sub',
  description: 'A sub-property of a value',
  viewer: SubEditor,
  editor: SubEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    registry.getExpressionMultiline(expr.value) || 
    expr.path.some((e) => 
      registry.getExpressionMultiline(e),
    )
  ,
  types: {
    condition: {
      isStart: () => true,
      isValid: () => true,
      getModifiers,
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers,
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers,
    },
  },
};

function getModifiers(requiredType: Type | null, expr: Expression, exprType: Type | null, registry: Registry): ListOptions<ExpressionModifierCallback>
{
  if (expr instanceof GetExpression 
   || expr instanceof SubExpression
   || !exprType
   || exprType.getSubTypes(registry.defs).length === 0)
  {
    return [];
  }

  return [{
    text: 'Sub Property',
    description: 'Get a sub property of the current value',
    value: () => new SubExpression(expr, []),
  }];
}
