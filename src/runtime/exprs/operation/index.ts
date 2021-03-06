import { ExpressionVisuals } from '../ExpressionVisuals';
import { OperationExpression } from 'expangine-runtime';

import OperationEditor from './OperationEditor.vue';
import { templateReplace } from '@/common';


const STARTING_PARAM = '$wrapped';

export const OperationVisuals: ExpressionVisuals<OperationExpression> =
{
  expr: OperationExpression,
  menu: 'Op',
  create: (forType) => new OperationExpression('', {}),
  name: 'Operation',
  description: 'Perform an operation',
  describe: ({ registry, expr }) => {
    const op = registry.getOperationVisuals(expr.name);

    return templateReplace(
      op.singleline,
      (token) => expr.params[token]
        ? '(' + registry.getExpressionDescribe(expr.params[token]) + ')'
        : op.defaults[token]
          ? op.defaults[token]
          : '{' + token + '}',
    );
  },
  viewer: OperationEditor,
  editor: OperationEditor,
  complex: true,
  isMultiline: (registry, expr) => false,
    // objectReduce(expr.params, (paramExpr, param, oneOf) => 
    //    (oneOf || registry.getExpressionMultiline(paramExpr)
    // ), false as boolean),
  getReturnExpressions: (registry, expr) => [expr],
  isStart: () => true,
  getModifiers: (requiredType, expr, exprType) => [{
    text: 'Operate',
    description: exprType 
      ? 'Perform an operation on the current expression'
      : requiredType
        ? 'Perform an operation to return the desired type'
        : 'Perform an operation',
    priority: 3,
    value: () => new OperationExpression('', { [STARTING_PARAM]: expr }),
  }],
};
