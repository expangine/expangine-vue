
import { ManyType, OrExpression } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeModifier } from '@/runtime/TypeModifier';
import { TypeBuilderWrapper } from '@/runtime/TypeBuilder';
import { getBuildType } from '@/app/BuildType';
import { ManyInput } from './ManyTypes';
import ManyEditor from './ManyEditor.vue';
import { initializeSubs } from '@/common';


export const ManyVisuals = createVisuals({
  type: ManyType,
  name: 'Many',
  description: 'A type that represents any number of possible types.',
  create: (registry, type) => registry.getVisuals(type.options[0]).create(registry, type.options[0]),
  isValid: (registry, type) => new OrExpression(
    type.options.map((t) => registry.getIsValid(t)),
  ),
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
    const { parent, type, typeSettings, registry } = input;

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
        
        return initializeSubs(registry, {
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
        });
      },
    };
  },
};

export const ManyBuilderWrapper: TypeBuilderWrapper =
{
  getOption: ({ registry }) => ({
    text: 'Possibly multiple types...',
    priority: 5,
    multiple: true,
    value: async (results) => (initializeSubs(registry, {
      type: new ManyType(results.map((r) => r.type)),
      settings: {
        input: 'many',
        defaultValue: results[0].type.create(),
        options: undefined,
        sub: results.map((r) => r.settings),
      },
    })),
  }),
};
