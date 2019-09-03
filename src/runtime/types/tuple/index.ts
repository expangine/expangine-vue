
import { Type, TupleType, ObjectType, TupleOps, OperationExpression } from 'expangine-runtime';
import { createVisuals, TypeSettings, TypeVisualInput } from '@/runtime/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/TypeBuilder';
import { TypeModifier } from '@/runtime/TypeModifier';
import { friendlyList } from '@/common';
import { TupleGridInput } from './TupleGridTypes';
import TupleEditor from './TupleEditor.vue';
import { getBuildType } from '@/app/BuildType';
import { TupleSubs } from './TupleTypes';


export const TupleVisuals = createVisuals({
  type: TupleType,
  name: 'Tuple',
  description: 'A fixed size array of types',
  create: () => OperationExpression.create(TupleOps.create, {}),
  editor: TupleEditor,
  defaultInput: 'grid',
  inputsOrder: ['grid'],
  inputs: {
    grid: TupleGridInput,
  },
});

export const TupleBuilder: TypeBuilder<TupleType> = 
{
  getOption: (input) => ({
    text: 'Tuple',
    description: 'A fixed size array of types',
    priority: 10,
    value: async () => {
      const types: Type[] = [];
      const settings: TypeSettings[] = [];

      for (;;) {
        const chosen = await getBuildType({
          input,
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

      if (types.length === 0) {
        return false;
      }

      return {
        type: new TupleType(types),
        settings: {
          input: 'grid',
          options: {
            title: '',
            columns: types.map((t) => ({ cols: 12 })),
          },
          defaultValue: types.map((t) => t.create()),
          sub: settings,
        },
      };
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

        const visuals = input.registry.getVisuals(type);
        const inputSelected = visuals.inputs[typeSettings.input] as TypeVisualInput<TupleType, any, TupleSubs>;

        type.options.push(chosen.type);
        (typeSettings as TypeSettings<any, number>).sub.push(chosen.settings);

        inputSelected.onSubAdd(type.options.length, type, typeSettings);

        return {
          kind: 'update',
          type,
          settings: typeSettings,
        };
      },
    };
  },
};

export const TupleModifierFromObject: TypeModifier<TupleType> = 
{
  getOption: (input) => {
    const { type, typeSettings } = input;
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
      value: async () => ({
        kind: 'change',
        type: new TupleType(values),
        settings: {
          input: 'grid',
          options: TupleGridInput.getDefaultOptions(),
          defaultValue: [],
          sub: settings,
        },
      }),
    };
  },
};

export const TupleBuilderWrapper: TypeBuilderWrapper =
{
  getOption: () => ({
    text: 'A tuple of...',
    priority: 6,
    multiple: true,
    value: async (results) => ({
      type: new TupleType(results.map((r) => r.type)),
      settings: {
        input: 'grid',
        defaultValue: [],
        options: TupleGridInput.getDefaultOptions(),
        sub: results.map((r) => r.settings),
      },
    }),
  }),
};
