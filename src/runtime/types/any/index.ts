
import { AnyType, AnyOps, ExpressionBuilder, TextOps} from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { AnyInput } from './AnyTypes';
import AnyEditor from './AnyEditor.vue';
import { TypeBuilder } from '../TypeBuilder';


const ex = new ExpressionBuilder();


export const AnyVisuals = createVisuals({
  type: AnyType,
  name: 'Any',
  description: 'Any value',
  describe: ({registry, type}) => 'Any value',
  describeLong: (registry, type, padding) => 'Any',
  toString: ({ value, type, process }) => process(value, type) + '',
  subOptions: (registry, type) => [],
  subSettings: (registry, type, settings, sub) => null,
  settingsFor: ({ registry, sub }) => ({ 
    input: 'any', 
    defaultValue: '', 
    options: { ...AnyInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub },
  }),
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


export const AnyBuilder: TypeBuilder =
{
  getOption: () => ({
    text: 'Any',
    description: 'A value that can be anything, defined by the user',
    priority: 15,
    value: async () => ({
      type: new AnyType({ }), 
      settings: { 
        input: 'any', 
        defaultValue: '',
        options: AnyInput.getDefaultOptions(), 
      },
    }),
  }),
};
