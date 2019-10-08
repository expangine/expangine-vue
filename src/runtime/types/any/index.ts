
import { AnyType, AnyOps, ExpressionBuilder, TextOps} from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { AnyInput } from './AnyTypes';
import AnyEditor from './AnyEditor.vue';


const ex = new ExpressionBuilder();


export const AnyVisuals = createVisuals({
  type: AnyType,
  name: 'Any',
  description: 'Any value',
  describe: (registry, type) => 'Any value',
  subOptions: (registry, type) => [],
  subSettings: (registry, type, settings, sub) => null,
  exprs: {
    create: (registry, type) => ex.op(TextOps.create, {}),
    valid: (registry, type) => ex.op(AnyOps.isValid, { value: ex.get('value') }),
    compare: (registry, type) => ex.op(AnyOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
    }),
  },
  editor: AnyEditor,
  defaultInput: 'any',
  inputsOrder: ['any'],
  inputs: {
    any: AnyInput,
  },
});
