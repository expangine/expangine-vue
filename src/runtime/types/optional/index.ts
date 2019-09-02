
import { Type, OptionalType, ConstantExpression } from 'expangine-runtime';
import { createVisuals, TypeSettings } from '@/runtime/TypeVisuals';
import { TypeModifier, TypeModifyResult } from '@/runtime/TypeModifier';
import { OptionalInput, OptionalSubs } from './OptionalTypes';
import { getConfirmation } from '@/app/Confirm';
import OptionalEditor from './OptionalEditor.vue';


export const OptionalVisuals = createVisuals({
  type: OptionalType,
  name: 'Optional',
  description: 'An optional value',
  create: (registry, type) => registry.getVisuals(type.options).create(registry, type.options),
  editor: OptionalEditor,
  defaultInput: 'optional',
  inputsOrder: ['optional'],
  inputs: {
    optional: OptionalInput,
  },
});

export const OptionalModifier: TypeModifier<OptionalType> = 
{
  getOption: (input) => {
    const { type, typeSettings, parent } = input;

    if (parent instanceof OptionalType || type instanceof OptionalType) {
      return false;
    }

    return {
      text: 'Make Optional',
      priority: 2,
      value: async () => {
        if (!await getConfirmation()) {
          return false;
        }
    
        return {
          kind: 'change',
          ...OptionalModifierTransform(type, typeSettings),
        };
      },
    };
  },
};

export const OptionalModifierRequire: TypeModifier = 
{
  getOption: (input) => {
    const { type, typeSettings } = input;

    if (!(type instanceof OptionalType)) {
      return false;
    }

    return { 
      text: 'Make Required',
      priority: 1,
      value: async () => {
        if (!await getConfirmation()) {
          return false;
        }

        return {
          kind: 'change',
          type: type.options,
          settings: (typeSettings as TypeSettings<any, OptionalSubs>).sub.innerType,
        };
      },
    };
  },
};

export function OptionalModifierTransform(type: Type, typeSettings: TypeSettings)
{
  return {
    type: new OptionalType(type),
    settings: { 
      input: 'optional',
      options: undefined,
      defaultValue: undefined,
      sub: { innerType: typeSettings },
    },
  };
}
