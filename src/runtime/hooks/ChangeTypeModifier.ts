
import { getBuildType } from '@/app/BuildType';
import { TypeModifier } from '../types/TypeModifier';
import { ExpressionBuilder } from 'expangine-runtime';


export const ChangeTypeModifier: TypeModifier = 
{
  getOption: ({ registry, parent, type, typeSettings }) => ({
    text: 'Change Type',
    description: 'Replace this type with a different type and try to convert the data',
    priority: 10,
    value: async () => {
      const chosen = await getBuildType({ 
        input: {
          registry,
          parent,
          existingType: type,
          existingSettings: typeSettings,
        },
        title: 'Choose New Type',
        ok: 'Change',
      });

      if (!chosen) {
        return false;
      }

      const ex = new ExpressionBuilder();
      const cast = `${type.getId()}:~${chosen.type.getId()}`;
      const castOperation = type.getOperations()[cast];
      const transform = castOperation
        ? ex.op(castOperation, { value: ex.get('value') })
        : type.getCreateExpression(ex);

      return {
        ...chosen,
        transform,
      };
    },
  }),
};
