
import { ManyType, ExpressionBuilder, AnyOps, isSameClass, Type } from 'expangine-runtime';
import { createVisuals, TypeSubOption } from '@/runtime/types/TypeVisuals';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { getBuildType } from '@/app/BuildType';
import { ManyInput } from './ManyTypes';
import ManyEditor from './ManyEditor.vue';
import { initializeSubs, friendlyList } from '@/common';


const ex = new ExpressionBuilder();

export const ManyVisuals = createVisuals({
  type: ManyType,
  name: 'Many',
  description: 'A type that represents any number of possible types.',
  describe: ({registry, type}) => friendlyList(type.options.map((t) => registry.getTypeDescribe(t)), ' or '),
  describeLong: (registry, type, padding, tab, newline) => 
    'One of [' + newline +
    type.options.map((t) => t
      ? padding + tab + registry.getTypeDescribeLong(t, tab, newline, padding + tab) + newline
      : '' ).join('') +
    padding + ']'
  ,
  toString: ({ registry, value, type, tab, newline, padding, process }) => {
    const found = type.options.find((t) => t.isValid(value));
    
    return found 
      ? registry.getTypeToString(value, found, tab, newline, padding, process)
      : value + '';
  },
  subOptions: (registry, type) => {
    const options: TypeSubOption[] = [];

    type.options.forEach((sub) => {
      registry.getTypeSubOptions(sub).forEach((option) => {
        const matching = options.find((existing) => 
          existing.key === option.key || (
            existing.key instanceof Type && 
            option.key instanceof Type && 
            isSameClass(existing.key, option.key)
          ),
        );

        if (!matching) {
          options.push(option);
        }
      });
    });

    return options;
  },
  subSettings: (registry, type, settings, sub) => {
    return null; // TODO
  },
  settingsFor: ({ registry, type, sub }) => {
    const subs = type.options.map((t, index) => registry.getTypeSettings(t, index));

    return {
      input: 'many',
      defaultValue: subs.map((s) => s.defaultValue),
      options: { ...registry.settingsOverrides, label: sub },
      sub: subs,
    };
  },
  exprs: {
    create: (registry, type) => registry.getTypeCreate(type.options[0]),
    valid: (registry, type) => ex.or(
      ...type.options.map((t) => registry.getTypeValid(t)),
    ),
    compare: (registry, type) => ex.op(AnyOps.cmp, {value: ex.get('value'), test: ex.get('test')}),
  },
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
      kind: 'build',
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
