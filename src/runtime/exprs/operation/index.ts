import { ExpressionVisuals } from '../ExpressionVisuals';
import { OperationExpression, objectReduce } from 'expangine-runtime';

import OperationEditor from './OperationEditor.vue';


const STARTING_PARAM = '$wrapped';

export const OperationVisuals: ExpressionVisuals<OperationExpression> =
{
  expr: OperationExpression,
  create: (forType) => new OperationExpression('', {}),
  name: 'Operation',
  description: 'Perform an operation',
  viewer: OperationEditor,
  editor: OperationEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    objectReduce(expr.params, (paramExpr, param, oneOf) => 
        (oneOf || registry.getExpressionMultiline(paramExpr)
    ), false as boolean)
  ,
  isStart: () => true,
  getModifiers: (requiredType, expr, exprType) => [{
    text: 'Operate',
    description: exprType 
      ? 'Perform an operation on the current expression'
      : requiredType
        ? 'Perform an operation to return the desired type'
        : 'Perform an operation',
    value: () => new OperationExpression('', { [STARTING_PARAM]: expr }),
  }],
};
