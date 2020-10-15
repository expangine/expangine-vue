import { NoExpression } from 'expangine-runtime';
import { createSwitch, DIRECTIVE_IF } from 'expangine-ui';
import { CompilerVisuals } from '../CompilerVisuals';


export const SwitchVisuals: CompilerVisuals = {
  name: DIRECTIVE_IF,
  label: () => DIRECTIVE_IF,
  getPreviews: () => [{
    name: 'Switch',
    description: 'Displays one of many possible components based on some value.',
    template: createSwitch(NoExpression.instance, []),
    preview: ['div', {}, {}, ['Switch']],
  }],
  editor: null as any,
  viewer: null as any,
};
