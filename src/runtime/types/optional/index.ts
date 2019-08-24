
import { OptionalType, AnyType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { OptionalInput, OptionalSubs } from './OptionalTypes';
import OptionalEditor from './OptionalEditor.vue';
import { confirm } from '@/app/Confirm';


const OptionalVisuals: TypeVisuals<OptionalType, false, true, OptionalSubs> = 
{
  type: OptionalType,
  newInstance: () => new OptionalType(new AnyType({})),
  name: 'Optional',
  description: 'An optional value',
  editor: OptionalEditor,
  modifiable: true,
  modifyLabel: 'Make Optional',
  canModify: (type, parent) => !(parent instanceof OptionalType),
  onModify: async (type, settings) => {
    if (!await confirm()) {
      return null;
    }

    return {
      type: new OptionalType(type),
      settings: { 
        input: 'optional',
        options: undefined,
        defaultValue: undefined,
        sub: { innerType: settings },
      },
    };
  },
  defaultInput: 'optional',
  inputsOrder: ['optional'],
  inputs: {
    optional: OptionalInput,
  },
};

export default OptionalVisuals;
