
import { getBuildType } from '@/app/BuildType';
import { TypeModifier } from '../TypeModifier';


export const ChangeTypeModifier: TypeModifier = 
{
  getOption: (input) => ({
    text: 'Change Type',
    priority: 10,
    value: async () => {
      const chosen = await getBuildType({ 
        input: {
          registry: input.registry, 
          parent: input.parent,
          existingType: input.type,
          existingSettings: input.typeSettings,
        },
        title: 'Choose New Type',
        ok: 'Change',
      });

      if (!chosen) {
        return false;
      }

      return {
        kind: 'change',
        ...chosen,
      };
    },
  }),
};