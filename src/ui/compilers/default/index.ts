import { COMPILER_DEFAULT } from 'expangine-ui';
import { CompilerVisuals } from '../CompilerVisuals';

export const DefaultVisuals: CompilerVisuals = {
  name: COMPILER_DEFAULT,
  getPreviews: () => [],
  label: ([tag]) => tag as string,
  editor: null as any,
  viewer: null as any,
};
