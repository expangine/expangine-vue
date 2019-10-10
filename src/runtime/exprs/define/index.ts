import { Expression, DefineExpression, NoExpression, objectEach, ExpressionMap, GetExpression, ConstantExpression, Type } from 'expangine-runtime';
import { ExpressionVisuals, ExpressionModifierCallback } from '../ExpressionVisuals';
import { obj, ListOptions } from '@/common';
import { Registry } from '@/runtime/Registry';

import DefineEditor from './DefineEditor.vue';


export const DefineVisuals: ExpressionVisuals<DefineExpression> =
{
  expr: DefineExpression,
  create: (forType) => new DefineExpression([], NoExpression.instance),
  name: 'Define',
  description: 'Define variables to use later',
  viewer: DefineEditor,
  editor: DefineEditor,
  complex: true,
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => false,
      isValid: () => false,
      getModifiers,
    },
    body: {
      isStart: () => true,
      isValid: () => true,
      getModifiers,
    },
    value: {
      isStart: () => false,
      isValid: () => false,
      getModifiers,
    },
  },
};

type ExpressionNamePair = [string, Expression];

function getModifiers(requiredType: Type | null, expr: Expression, exprType: Type | null, registry: Registry): ListOptions<ExpressionModifierCallback>
{
  const options: ListOptions<ExpressionModifierCallback> = [];

  if (!registry.getExpressionsValid('value', null, expr, exprType)) {
    return options;
  }

  const { define, before } = getDefineAndBefore(expr);

  options.push({
    text: 'Cache Result',
    description: 'Store the result of the expression in a variable in a new define expression inserted here',
    value: () => {
      return new DefineExpression([['temp', expr]], NoExpression.instance);
    },
  });

  if (define) {
    
    options.push({
      text: 'Add as Define Variable',
      description: 'Add this expression to the define expression as a variable',
      value: {
        options: {
          message: 'If this expression references scoped variables, this action will mess up those references.',
        },
        handler: () => {
          if (!define) {
            throw new Error();
          }

          const exprName = getTempName(define);
          const newDefine = getNewDefine(define, before, expr, exprName);

          define.define = newDefine;

          return new GetExpression([new ConstantExpression(exprName)]);
        },
      },
    });
  }

  return options;
}

function getDefineAndBefore(expr: Expression): { define: DefineExpression | null, before: Expression }
{
  let prev = expr;
  let next = expr.parent;
  
  while (next) 
  {
    if (next instanceof DefineExpression) 
    {
      return { define: next, before: prev };
    }

    prev = next;
    next = next.parent;
  }

  return { define: null, before: prev };
}

function getTempName(define: DefineExpression): string
{
  const varBase = 'temp';
  let varName = varBase;
  let varIndex = 0;

  while (define.define.some(([name]) => name === varName))
  {
    varName = varBase + ++varIndex;
  }

  return varName;
}

function getNewDefine(define: DefineExpression, before: Expression, expr: Expression, exprName: string): ExpressionNamePair[]
{
  const vars = define.define.slice();
  const index = vars.findIndex(([, varExpr]) => varExpr === before);

  if (index === -1) 
  {
    vars.push([exprName, expr]);
  } 
  else 
  {
    vars.splice(index, 0, [exprName, expr]);
  }

  return vars;
}
