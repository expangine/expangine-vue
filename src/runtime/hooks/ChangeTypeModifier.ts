
import { ObjectType, NullType } from 'expangine-runtime';
import { castExpression } from '@/common';
import { getBuildType } from '@/app/BuildType';
import { getProgram } from '@/app/GetProgram';
import { TypeModifier } from '../types/TypeModifier';


export const ChangeTypeModifier: TypeModifier = 
{
  getOption: ({ registry, parent, type, typeSettings, noTransform }) => ({
    text: 'Change Type',
    description: 'Replace this type with a different type and try to convert the data',
    priority: 10,
    value: async () => {
      const chosen = await getBuildType({ 
        title: 'Choose New Type',
        ok: 'Change',
        input: {
          registry,
          parent,
          existingType: type,
          existingSettings: typeSettings,
        },
      });

      if (!chosen) {
        return false;
      }

      const updateEvent = { ...chosen };

      if (!noTransform) 
      {
        const result = await getProgram({
          title: 'Change Type',
          message: 'The expression that changes the type.',
          confirm: 'Change',
          registry,
          context: ObjectType.from({
            parent: parent || NullType.baseType,
            value: type,
          }),
          program: castExpression(type, chosen.type),
          expectedType: chosen.type,
        });
  
        if (!result) {
          return false;
        }

        updateEvent.transform = result.program;
      }

      return updateEvent;
    },
  }),
};
