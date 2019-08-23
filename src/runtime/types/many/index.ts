
import { ManyType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { ManyInput, ManySubs } from './ManyTypes';
import ManyEditor from './ManyEditor.vue';


const ManyVisuals: TypeVisuals<ManyType, false, true, ManySubs> = 
{
  type: ManyType,
  newInstance: () => new ManyType([]),
  name: 'Many',
  description: 'A type that represents any number of possible types.',
  editor: ManyEditor,
  modifiable: true,
  modifyLabel: 'Allow Multiple Types',
  canModify: (type, parent) => !(parent instanceof ManyType),
  onModify: async (type, settings) => ({
    type: new ManyType([type]),
    settings: { 
      input: 'many',
      options: undefined,
      defaultValue: undefined,
      sub: { [type.getId()]: settings },
    },
  }),
  defaultInput: 'many',
  inputsOrder: ['many'],
  inputs: {
    many: ManyInput,
  },
};

export default ManyVisuals;
