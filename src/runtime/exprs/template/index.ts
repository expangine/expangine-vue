import { TemplateExpression, NoExpression } from 'expangine-runtime';
import { ExpressionVisuals } from '../ExpressionVisuals';
import { obj } from '@/common';

import TemplateEditor from './TemplateEditor.vue';


export const TemplateVisuals: ExpressionVisuals<TemplateExpression> =
{
  expr: TemplateExpression,
  create: (forType) => new TemplateExpression('', obj()),
  name: 'Template',
  description: 'Text with variables injected into it',
  viewer: TemplateEditor,
  editor: TemplateEditor,
  complex: true,
  isMultiline: () => true,
  types: {
    condition: {
      isStart: () => true,
      isValid: () => false,
      getModifiers: () => [],
    },
    body: {
      isStart: () => false,
      isValid: () => false,
      getModifiers: () => [],
    },
    value: {
      isStart: () => true,
      isValid: () => true,
      getModifiers: () => [],
    },
  },
};
