
import { Type, OptionalType, ConstantExpression } from 'expangine-runtime';
import { createVisuals, TypeSettings } from '@/runtime/TypeVisuals';
import { TypeModifier, TypeModifyResult } from '@/runtime/TypeModifier';
import { OptionalInput, OptionalSubs } from './OptionalTypes';
import { getConfirmation } from '@/app/Confirm';
import OptionalEditor from './OptionalEditor.vue';
import { initializeSubs } from '@/common';
import { Registry } from '@/runtime/Registry';


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
    const { type, typeSettings, registry, parent } = input;

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
          ...OptionalModifierTransform(registry, type, typeSettings),
        };
      },
    };
  },
};

export const OptionalModifierRequire: TypeModifier = 
{
  getOption: (input) => {
    const { type, typeSettings, registry } = input;

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

        return initializeSubs(registry, {
          kind: 'change',
          type: type.options,
          settings: (typeSettings as TypeSettings<any, OptionalSubs>).sub.innerType,
        });
      },
    };
  },
};

export function OptionalModifierTransform(registry: Registry, type: Type, typeSettings: TypeSettings)
{
  return initializeSubs(registry, {
    type: new OptionalType(type),
    settings: { 
      input: 'optional',
      options: Object.create(null),
      defaultValue: undefined,
      sub: { innerType: typeSettings },
    },
  });
}
