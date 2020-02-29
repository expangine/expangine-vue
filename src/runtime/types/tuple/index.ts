
import { Type, TupleType, ObjectType, ListType, isNumber, copy, NumberType, isArray, isString, Types } from 'expangine-runtime';
import { createVisuals, TypeSettings, TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { friendlyList, initializeSubs, isExactType } from '@/common';
import { TupleGridInput } from './TupleGridTypes';
import { getBuildType } from '@/app/BuildType';
import { TupleSubs } from './TupleTypes';
import TupleEditor from './TupleEditor.vue';


export const TupleVisuals = createVisuals<TupleSubs>()({
  type: TupleType,
  name: 'Tuple',
  description: 'A fixed size array of types',
  describe: ({registry, type}) => 'Tuple [' + type.options.map((t) => registry.getTypeDescribe(t)).join(', ') + ']',
  describeLong: (registry, type, padding, tab, newline) => 
    'Tuple [' + newline +
    type.options.map((element, index) => element
      ? padding + tab + index + ': ' + registry.getTypeDescribeLong(element, tab, newline, padding + tab) + newline
      : '').join('') +
    padding + ']'
  ,
  stringify: ({ registry, value, type }) => 
    '[' +
      type.options.map((element, index) => 
        registry.getTypeStringify(element, value[index]),
      ).join(',') + 
    ']'
  ,
  toString: ({ registry, value, type, tab, newline, padding, process, processInvalid }) => {
    if (!isArray(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    return 'Tuple [' + newline + 
      value.map((item: any, index: number) => type.options[index]
        ? padding + tab + registry.getTypeToString(item, type.options[index], tab, newline, padding + tab, process, processInvalid) + newline
        : '').join('') + 
      padding + ']';
  },
  subNodes: ({ registry, type, value }) => value.map((item: any, index: any) => ({
    sub: index,
    subType: Types.INDEX,
    value: item,
    valueType: type.options[index],
  })),
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = key === 'length'
      ? 'length'
      : isNumber(key)
        ? '[ ' + key + ' ]'
        : '[ index ]';
    const description = key === 'length'
      ? 'The number of elements in the tuple (~' + type.options.length + ')'
      : isNumber(key)
        ? registry.getTypeDescribeLong(type.options[key], '', '  ')
        : key instanceof NumberType
          ? 'A number value for a given dynamic element'
          : 'An enum value for a given dynamic element';

    return { key, value, text, description };
  }),
  subSettings: (registry, type, settings, sub, forKey) => {
    return isNumber(sub.key)
      ? forKey
        ? registry.getTypeSettings(Types.INDEX)
        : settings.sub[sub.key]
      : null;
  },
  settingsFor: ({ registry, type, sub }) => {
    const subs = type.options.map((t, index) => registry.getTypeSettings(t, index));

    return {
      input: 'grid',
      defaultValue: subs.map((s) => s.defaultValue),
      options: { 
        ...TupleGridInput.getDefaultOptions(), 
        ...registry.settingsOverrides, 
        label: sub + '',
        columns: subs.map(() => ({ cols: 12 })),
      },
      sub: subs,
    };
  },
  editor: TupleEditor,
  defaultInput: 'grid',
  inputsOrder: ['grid'],
  inputs: {
    grid: TupleGridInput,
  },
});

export const TupleBuilder: TypeBuilder = 
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
      description: 'Adds another element to the tuple',
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
        const tupleSettings = typeSettings as TypeSettings<any, TupleSubs>;

        type.options.push(chosen.type);
        tupleSettings.sub.push(chosen.settings);

        inputSelected.onSubAdd(type.options.length, type, tupleSettings);

        return initializeSubs(registry, {
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
    if (!isExactType(type, ObjectType)) {
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
      description: names.length ? friendlyList(names) : 'An empty tuple',
      priority: 14,
      value: async () => (initializeSubs(registry, {
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

export const TupleModifierFromList: TypeModifier<TupleType> = 
{
  getOption: (input) => {
    const { type, typeSettings, registry } = input;
    if (!(type instanceof ListType) 
      || !isNumber(type.options.min) 
      || !isNumber(type.options.max) 
      || type.options.min !== type.options.max) {
      return false;
    }

    const { min: size, item } = type.options;
    const values: Type[] = [];
    const settings: TypeSettings[] = [];

    for (let i = 0; i < size; i++) {
      values.push(item.clone());
      settings.push(copy((typeSettings as TypeSettings<any, string>).sub.item));
    }

    return {
      text: 'Convert to Tuple',
      description: size + ' ' + registry.getTypeDescribeLong(item, '', ' '),
      priority: 15,
      value: async () => (initializeSubs(registry, {
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
