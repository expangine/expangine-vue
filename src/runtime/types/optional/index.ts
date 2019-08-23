
import { OptionalType, AnyType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { OptionalInput } from './OptionalTypes';
import OptionalEditor from './OptionalEditor.vue';


const OptionalVisuals: TypeVisuals<OptionalType, false, true, 'innerType'> = 
{
  type: OptionalType,
  newInstance: () => new OptionalType(new AnyType({})),
  name: 'Optional',
  description: 'An optional value',
  editor: OptionalEditor,
  modifiable: true,
  modifyLabel: 'Make Optional',
  canModify: (type, parent) => !(parent instanceof OptionalType),
  onModify: async (type, settings) => ({
    type: new OptionalType(type),
    settings: { 
      input: 'optional',
      options: undefined,
      defaultValue: undefined,
      sub: { innerType: settings },
    },
  }),
  defaultInput: 'optional',
  inputsOrder: ['optional'],
  inputs: {
    optional: OptionalInput,
  },
};

export default OptionalVisuals;
