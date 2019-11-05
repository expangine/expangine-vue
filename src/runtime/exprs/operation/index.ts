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
  describe: ({ registry, expr }) => registry.getOperationVisuals(expr.name).singleline.split(/[\{\}]/g).map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else if (expr.params[part]) {
      return '(' + registry.getExpressionDescribe(expr.params[part]) + ')';
    } else {
      return '{' + part + '}';
    }
  }).join(''),
  viewer: OperationEditor,
  editor: OperationEditor,
  complex: true,
  isMultiline: (registry, expr) => 
    objectReduce(expr.params, (paramExpr, param, oneOf) => 
        (oneOf || registry.getExpressionMultiline(paramExpr)
    ), false as boolean)
  ,
  getReturnExpressions: (registry, expr) => [expr],
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
