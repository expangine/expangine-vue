
import { ManyType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { ManyInput, ManySubs } from './ManyTypes';
import ManyEditor from './ManyEditor.vue';
import { getBuildType } from '@/app/BuildType';


const ManyVisuals: TypeVisuals<ManyType, false, true, ManySubs> = 
{
  type: ManyType,
  newInstance: () => new ManyType([]),
  name: 'Many',
  description: 'A type that represents any number of possible types.',
  editor: ManyEditor,
  modifiable: true,
  modifyLabel: 'Add Alternative Type',
  canModify: (type, parent) => !(parent instanceof ManyType),
  onModify: async (existingType, existingSettings) => {
    const alternativeType = await getBuildType({
      title: 'Alternative Type',
      ok: 'Add',
      exclude: {
        [existingType.getId()]: true,
      },
    });

    if (!alternativeType) {
      return null;
    }

    const { type, settings } = await alternativeType.onBuild();
    
    return {
      type: new ManyType([existingType, type]),
      settings: {
        input: 'many',
        options: undefined,
        defaultValue: undefined,
        sub: {
          [existingType.getId()]: existingSettings,
          [type.getId()]: settings,
        },
      },
    };
  },
  defaultInput: 'many',
  inputsOrder: ['many'],
  inputs: {
    many: ManyInput,
  },
};

export default ManyVisuals;
