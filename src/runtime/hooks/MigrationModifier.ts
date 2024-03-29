
import { NoExpression, TypeMap, Types } from 'expangine-runtime';
import { getProgram } from '@/app/GetProgram';
import { TypeModifier } from '../types/TypeModifier';


export const MigrationModifier: TypeModifier = 
{
  getOption: ({ registry, parent, type, noTransform }) => 
  {  
    if (noTransform) {
      return false;
    }

    return {
      text: 'Migrate',
      description: 'Migrate this type with an expression',
      priority: 10,
      value: async () => {
        const context: TypeMap = {};
        if (parent) {
          context.parent = parent;
        } 
        if (type) {
          context.value = type;
        }

        const result = await getProgram({
          title: 'Migrate',
          message: 'The type can be changed to a new type based on a migration expression.',
          confirm: 'Migrate',
          registry,
          context: Types.object(context),
          program: NoExpression.instance,
        });

        if (!result || !result.returnType) {
          return false;
        }

        return {
          type: result.returnType,
          settings: registry.getTypeSettings(result.returnType),
          transform: result.program,
        };
      },
    };
  },
};
