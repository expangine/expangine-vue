import { NoExpression } from 'expangine-runtime';
import { createIf, DIRECTIVE_IF } from 'expangine-ui';
import { CompilerVisuals } from '../CompilerVisuals';


export const IfVisuals: CompilerVisuals = {
  name: DIRECTIVE_IF,
  label: () => DIRECTIVE_IF,
  getPreviews: (registry) => [{
    name: 'If',
    description: 'Conditionally displays a component.',
    template: createIf(NoExpression.instance, []),
    preview: ['div', {}, {}, ['If']],
  }],
  editor: null as any,
  viewer: null as any,
};
