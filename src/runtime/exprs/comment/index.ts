import { ExpressionVisuals } from '../ExpressionVisuals';
import { CommentExpression } from 'expangine-runtime';

import CommentEditor from './CommentEditor.vue';


export const CommentVisuals: ExpressionVisuals<CommentExpression> =
{
  expr: CommentExpression,
  create: (forType) => new CommentExpression(''),
  name: 'Comment',
  description: 'Add a comment to document your code',
  describe: ({ registry, expr }) => 'Comment: ' + expr.comment,
  viewer: CommentEditor,
  editor: CommentEditor,
  complex: false,
  isMultiline: (registry, expr) => true,
  getReturnExpressions: (registry, expr) => [],
  isStart: () => true,
  getModifiers: (requiredType, expr) => [],
};
