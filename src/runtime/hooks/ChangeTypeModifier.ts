
import { getBuildType } from '@/app/BuildType';
import { TypeModifier } from '../types/TypeModifier';
import { ExpressionBuilder } from 'expangine-runtime';


export const ChangeTypeModifier: TypeModifier = 
{
  getOption: ({ registry, parent, type, typeSettings }) => ({
    text: 'Change Type',
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
      const visual = registry.getTypeVisuals(chosen.type);
      const cast = `${type.getId()}:~${chosen.type.getId()}`;
      const castOperation = type.getOperations()[cast];
      const transform = castOperation
        ? ex.op(castOperation, { value: ex.get('value') })
        : visual.exprs.create(registry, type);

      return {
        ...chosen,
        transform,
      };
    },
  }),
};
