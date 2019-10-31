import { ExpressionVisuals } from '../ExpressionVisuals';
import { ForExpression, NoExpression, ObjectType } from 'expangine-runtime';

import ForEditor from './ForEditor.vue';


export const ForVisuals: ExpressionVisuals<ForExpression> =
{
  expr: ForExpression,
  create: (forType, context) => new ForExpression(
    ['i', 'k', 'j', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'w']
      .find((v) => context instanceof ObjectType 
        ? context.options.props[v]
           ? false
           : true
        : true) || 'i', 
    NoExpression.instance, 
    NoExpression.instance, 
    NoExpression.instance,
  ),
  name: 'For',
  description: 'Execute an expression a number of times',
  viewer: ForEditor,
  editor: ForEditor,
  complex: true,
  isMultiline: () => true,
  isStart: () => true,
  getModifiers: () => [],
};
