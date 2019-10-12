
import { Type, TupleType, ObjectType, TupleOps, ExpressionBuilder, NumberOps, isNumber} from 'expangine-runtime';
import { createVisuals, TypeSettings, TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { friendlyList, initializeSubs } from '@/common';
import { TupleGridInput } from './TupleGridTypes';
import { getBuildType } from '@/app/BuildType';
import { TupleSubs } from './TupleTypes';
import TupleEditor from './TupleEditor.vue';
import { OptionalInput } from '../optional/OptionalTypes';


const ex = new ExpressionBuilder();

export const TupleVisuals = createVisuals({
  type: TupleType,
  name: 'Tuple',
  description: 'A fixed size array of types',
  describe: (registry, type) => 'Tuple [' + type.options.map((t) => registry.getTypeDescribe(t)).join(', ') + ']',
  describeLong: (registry, type, padding, tab, newline) => 
    'Tuple [' + newline +
    type.options.map((element, index) => padding + tab + index + ': ' + registry.getTypeDescribeLong(element, tab, newline, padding + tab) + newline).join('') +
    padding + ']'
  ,
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = key === 'length'
      ? 'length'
      : isNumber(key)
        ? '[ ' + key + ' ]'
        : '[ index ]';
    const description = key === 'length'
      ? 'The number of elements in the tuple (~' + type.options.length + ')'
      : isNumber(key)
        ? registry.getTypeDescribe(type.options[key])
        : 'A value for a given dynamic element';

    return { key, value, text, description };
  }),
  subSettings: (registry, type, settings, sub, forKey) => {
    return isNumber(sub.key)
      ? forKey
        ? registry.getTypeSettings(TupleType.indexType)
        : settings.sub[sub.key]
      : null;
  },
  settingsFor: ({ registry, type, sub }) => {
    const subs = type.options.map((t, index) => registry.getTypeSettings(t, index));

    return {
      input: 'grid',
      defaultValue: subs.map((s) => s.defaultValue),
      options: { ...TupleGridInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub },
      sub: subs,
    };
  },
  exprs: {
    create: () => ex.op(TupleOps.create, {}),
    valid: (registry, type) => ex
      .op(TupleOps.isValid, {
        value: ex.get('value'),
      })
      .and(type.options.map((t, i) => ex
        .define({ value: ex.get('value', i) })
        .run(registry.getTypeValid(t)),
      ),
    ),
    compare: (registry, type) => ex.or(
      ex.op(NumberOps.cmp, {
        value: ex.get('value', 'length'),
        test: ex.get('test', 'length'),
      }),
      ...type.options.map((t, i) => ex
        .define({
          value: ex.get('value', i),
          test: ex.get('test', i),
        })
        .run(registry.getTypeCompare(t)),
      ),
    ),
  },
  editor: TupleEditor,
  defaultInput: 'grid',
  inputsOrder: ['grid'],
  inputs: {
    grid: TupleGridInput,
  },
});

export const TupleBuilder: TypeBuilder<TupleType> = 
{
  getOption: ({ registry, parent, parentSettings, existingType, existingSettings }) => ({
    text: 'Tuple',
    description: 'A fixed size array of types',
    priority: 10,
    value: async () => {
      const types: Type[] = [];
      const settings: TypeSettings[] = [];

      if (existingType && existingSettings) {
        types.push(existingType);
        settings.push(existingSettings);
      } else  {
        for (;;) {
          const chosen = await getBuildType({
            input: { registry, parent, parentSettings },
            title: `Choose Type [${types.length + 1}]`,
            ok: 'Add Type',
            cancel: types.length === 0 ? 'Cancel' : 'Done',
          });
  
          if (!chosen) {
            break;
          }
  
          types.push(chosen.type);
          settings.push(chosen.settings);
        }
      }

      if (types.length === 0) {
        return false;
      }

      return initializeSubs(registry, {
        type: new TupleType(types),
        settings: {
          input: 'grid',
          options: TupleGridInput.getDefaultOptions(),
          defaultValue: types.map((t) => t.create()),
          sub: settings,
        },
      });
    },
  }),
};

export const TupleModifierAddType: TypeModifier<TupleType> = 
{
  getOption: (input) => {
    const { registry, type, typeSettings, parent } = input;
    if (!(type instanceof TupleType)) {
      return false;
    }

    return { 
      text: `Add Tuple Type [${type.options.length + 1}]`,
      priority: 1,
      value: async () => {
        const chosen = await getBuildType({
          input: {
            registry,
            parent,
            existingType: type,
            existingSettings: typeSettings,
          },
          title: `Choose Type [${type.options.length + 1}]`,
          ok: 'Add Type',
        });

        if (!chosen) {
          return false;
        }

        const visuals = registry.getTypeVisuals(type);
        const inputSelected = visuals.inputs[typeSettings.input] as TypeVisualInput<TupleType, any, TupleSubs>;

        type.options.push(chosen.type);
        (typeSettings as TypeSettings<any, number>).sub.push(chosen.settings);

        inputSelected.onSubAdd(type.options.length, type, typeSettings);

        return initializeSubs(registry, {
          kind: 'update',
          type,
          settings: typeSettings,
        });
      },
    };
  },
};

export const TupleModifierFromObject: TypeModifier<TupleType> = 
{
  getOption: (input) => {
    const { type, typeSettings, registry } = input;
    if (!(type instanceof ObjectType)) {
      return false;
    }

    const props = type.options.props;
    const names = Object.keys(props);
    const values: Type[] = [];
    const settings: TypeSettings[] = [];

    for (const prop in props) {
      values.push(props[prop]);
      settings.push((typeSettings as TypeSettings<any, string>).sub[prop]);
    }

    return {
      text: 'Convert to Tuple',
      description: friendlyList(names),
      priority: 14,
      value: async () => (initializeSubs(registry, {
        kind: 'change',
        type: new TupleType(values),
        settings: {
          input: 'grid',
          options: TupleGridInput.getDefaultOptions(),
          defaultValue: [],
          sub: settings,
        },
      })),
    };
  },
};

export const TupleBuilderWrapper: TypeBuilderWrapper =
{
  getOption: (input) => ({
    text: 'A tuple of...',
    priority: 6,
    multiple: true,
    value: async (results) => (initializeSubs(input.registry, {
      type: new TupleType(results.map((r) => r.type)),
      settings: {
        input: 'grid',
        defaultValue: [],
        options: TupleGridInput.getDefaultOptions(),
        sub: results.map((r) => r.settings),
      },
    })),
  }),
};
