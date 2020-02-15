
import { Type, OptionalType } from 'expangine-runtime';
import { createVisuals, TypeSettings } from '@/runtime/types/TypeVisuals';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { OptionalInput, OptionalSubs } from './OptionalTypes';
import { getConfirmation } from '@/app/Confirm';
import { initializeSubs, obj } from '@/common';
import { Registry } from '@/runtime/Registry';
import OptionalEditor from './OptionalEditor.vue';
import { Preferences } from '@/app/Preference';


const PREF_MAKE_OPTIONAL = Preferences.define({
  key: 'optional_make',
  label: 'Make type Optional without confirmation',
  defaultValue: false,
});

const PREF_MAKE_REQUIRED = Preferences.define({
  key: 'optional_unmake',
  label: 'Make Optional Required without Confirmation',
  defaultValue: false,
});


export const OptionalVisuals = createVisuals<OptionalSubs>()({
  type: OptionalType,
  name: 'Optional',
  description: 'An optional value',
  describe: ({ registry, type }) => registry.getTypeDescribe(type.options) + ' (optional)',
  describeLong: (registry, type, padding, tab, newline) => 
    'Optional ' + registry.getTypeDescribeLong(type.options, tab, newline, padding)
  ,
  stringify: ({ registry, type, value }) => 
    value === undefined 
      ? 'undefined'
      : value === null
        ? 'null'
        : registry.getTypeStringify(type.options, value)
  ,
  toString: ({ registry, value, type, tab, newline, padding, process, processInvalid }) => {
    if (value === undefined || value === null) {
      return 'undefined';
    }

    return registry.getTypeToString(value, type.options, tab, newline, padding, process, processInvalid);
  },
  subNodes: ({ registry, type, value }) => 
    value === undefined || value === null
      ? []
      : registry.getTypeSubNodes(value, type.options)
  ,
  subOptions: (registry, type) => registry.getTypeSubOptions(type.options),
  subSettings: (registry, type, settings, sub) => {
    return settings.sub ? settings.sub.innerType : null;
  },
  settingsFor: ({ registry, type, sub }) => ({ 
    input: 'optional', 
    defaultValue: undefined, 
    options: { ...OptionalInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub + '' }, 
    sub: { 
      innerType: registry.getTypeSettings(type.options, sub), 
    },
  }),
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
      description: 'An optional type does not require a value',
      priority: 2,
      value: async () => {
        if (!await getConfirmation({ pref: PREF_MAKE_OPTIONAL })) {
          return false;
        }
    
        return OptionalModifierTransform(registry, type, typeSettings);
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
      description: 'The type should no longer be optional',
      priority: 1,
      value: async () => {
        if (!await getConfirmation({ pref: PREF_MAKE_REQUIRED })) {
          return false;
        }

        return initializeSubs(registry, {
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
      options: obj(),
      defaultValue: undefined,
      sub: obj({ innerType: typeSettings }),
    },
  });
}
