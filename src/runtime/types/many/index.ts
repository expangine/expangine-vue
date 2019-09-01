
import { ManyType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeModifier } from '@/runtime/TypeModifier';
import { getBuildType } from '@/app/BuildType';
import { ManyInput } from './ManyTypes';
import ManyEditor from './ManyEditor.vue';


export const ManyVisuals = createVisuals({
  type: ManyType,
  name: 'Many',
  description: 'A type that represents any number of possible types.',
  editor: ManyEditor,
  defaultInput: 'many',
  inputsOrder: ['many'],
  inputs: {
    many: ManyInput,
  },
});

export const ManyModifier: TypeModifier<ManyType> = 
{
  getOption: (input) => {
    const { parent, type, typeSettings } = input;

    if (parent instanceof ManyType) {
      return false;
    }

    return {
      text: 'Add Alternative Type',
      priority: 2,
      value: async () => {
        const chosen = await getBuildType({
          input,
          title: 'Alternative Type',
          ok: 'Add',
        });
    
        if (!chosen) {
          return false;
        }
        
        return {
          kind: 'change',
          type: new ManyType([type, chosen.type]),
          settings: {
            input: 'many',
            options: undefined,
            defaultValue: undefined,
            sub: [
              typeSettings,
              chosen.settings,
            ],
          },
        };
      },
    };
  },
};
