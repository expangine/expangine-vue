
import { ListType, TextType, isString, isArray, ObjectType, objectReduce, objectValues, SetType, NullType, MapType, isNumber, Exprs, Types } from 'expangine-runtime';
import { createVisuals, TypeSettings, TypeSettingsAny } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TextBoxInput } from '../text/TextBoxTypes';
import { ListListInput } from './ListListTypes';
import { ListComboInput } from './ListComboTypes';
import { ListEnumSelectInput } from './ListEnumSelectTypes';
import { ListEnumAutocompleteInput } from './ListEnumAutocompleteTypes';
import { ListEnumCheckboxInput } from './ListEnumCheckboxTypes';
import { ListEntityAutocompleteInput } from './ListEntityAutocompleteTypes';
import { ListObjectTableInput } from './ListObjectTableTypes';
import ListEditor from './ListEditor.vue';
import ListOptions from './ListOptions.vue';
import { initializeSubs } from '@/common';
import { ListSubs } from './ListTypes';
import { TypeModifier } from '../TypeModifier';
import { getConfirmation } from '@/app/Confirm';
import { getProgram } from '@/app/GetProgram';
import { Preferences, PreferenceCategory } from '@/app/Preference';


const PREF_LIST_MODIFIER = Preferences.define({
  key: 'list_modifier',
  label: 'Convert type to List without confirmation',
  category: [PreferenceCategory.DESIGN, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export const ListVisuals = createVisuals<ListSubs>()({
  type: ListType,
  name: () => 'List',
  description: 'A list of values.',
  describe: ({registry, type}) => 'List of ' + registry.getTypeDescribe(type.options.item),
  describeLong: (registry, type, padding, tab, newline) => 
    'List of ' + registry.getTypeDescribeLong(type.options.item, tab, newline, padding)
  ,
  stringify: ({ registry, type, value }) => '[' + value.map((v: any) => registry.getTypeStringify(type.options.item, v)).join(',') + ']',
  toString: ({ registry, value, type, tab, newline, padding, process, processInvalid }) => {
    if (!isArray(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    return '[' + newline + 
      value.map((item: any) => padding + tab + registry.getTypeToString(item, type.options.item, tab, newline, padding + tab, process, processInvalid) + newline).join('') + 
      padding + ']';
  },
  subNodes: ({ registry, type, value }) => value.map((item: any, index: any) => ({
    sub: index,
    subType: Types.INDEX,
    value: item,
    valueType: type.options.item,
  })),
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = key === 'length'
      ? 'length'
      : isNumber(key)
        ? `[ ${key} ]`
        : '[ index ]';
    const description = key === 'length'
      ? 'The number of items in the list'
      : isNumber(key)
        ? registry.getTypeDescribeLong(type.options.item, '', '  ')
        : registry.getTypeDescribeLong(type.options.item, '', '  ') + ' at a given index';

    return { key, value, text, description };
  }),
  subSettings: (registry, type, settings, sub, forKey) => {
    return !forKey && sub.key === Types.INDEX
      ? settings.sub.item
      : null;
  },
  settingsFor: ({ registry, type, sub }) => {
    const item = type.options.item;
    const settings = registry.getTypeSettings(item, sub);

    if (item instanceof ObjectType) { 
      const objectSettings = settings as TypeSettings<any, string>;
      const complexity = objectReduce(objectSettings.sub, (propSetting, prop, max) => 
        Math.max(max, registry.getTypeVisualInputComplexity(item.options.props[prop], propSetting))
      , 0);

      if (complexity === 0) {
        const propSubs = settings.sub as Record<string, TypeSettingsAny>;
        for (const prop in propSubs) {
          const propValue = propSubs[prop];
          if (propValue.options) {
            delete propValue.options.label;
            delete propValue.options.placeholder;
          }
        }

        return {
          input: 'table',
          defaultValue: [],
          options: { 
            ...ListObjectTableInput.getDefaultOptions(), 
            ...registry.settingsOverrides,
            title: sub + '', 
            itemName: sub + '',
            paging: true,
            pagination: {
              totalVisible: 10,
            },
            columns: objectValues(item.options.props, (propType, prop) => ({
              prop,
              label: prop,
            })),
          },
          sub: {
            item: settings,
          },
        };
      } else {
        return {
          input: 'list',
          defaultValue: [],
          options: { 
            ...ListListInput.getDefaultOptions(), 
            ...registry.settingsOverrides,
            title: sub + '', 
            itemName: sub + '',
            paging: true,
            pagination: {
              totalVisible: 10,
            },
            pageSize: complexity === 1 ? 5 : 1,
          },
          sub: {
            item: settings,
          },
        };
      }
    }

    return {
      input: 'list', 
      defaultValue: [], 
      options: { 
        ...ListListInput.getDefaultOptions(), 
        ...registry.settingsOverrides, 
        title: sub + '',
        itemName: sub + '',
      }, 
      sub: { 
        item: settings, 
      },
    };
  },
  editor: ListEditor,
  options: ListOptions,
  defaultInput: 'list',
  inputsOrder: ['list', 'combo', 'select', 'autocomplete', 'checkbox', 'table', 'entity'],
  inputs: {
    list: ListListInput,
    combo: ListComboInput,
    select: ListEnumSelectInput,
    autocomplete: ListEnumAutocompleteInput,
    checkbox: ListEnumCheckboxInput,
    table: ListObjectTableInput,
    entity: ListEntityAutocompleteInput,
  },
});

export const ListBuilder: TypeBuilder = 
{
  getOption: ({ registry, existingType, existingSettings }) => ({
    text: 'List',
    description: 'A collection/list/array of values',
    priority: 4,
    value: async () => (initializeSubs(registry, {
      type: ListType.forItem(existingType || new TextType({ })),
      settings: {
        input: 'list',
        defaultValue: [],
        options: ListListInput.getDefaultOptions(),
        sub: { 
          item: existingSettings || { 
            input: 'textbox', 
            defaultValue: '',
            options: TextBoxInput.getDefaultOptions(), 
          },
        },
      },
    })),
  }),
};

export const ListBuilderWrapper: TypeBuilderWrapper =
{
  getOption: ({ registry }) => ({
    text: 'List of...',
    priority: 2,
    value: async ([{ type, settings }]) => (initializeSubs(registry, {
      type: ListType.forItem(type),
      settings: {
        input: 'list',
        defaultValue: [],
        options: ListListInput.getDefaultOptions(),
        sub: {
          item: settings,
        },
      },
    })),
  }),
};

export const ListModifierFromValue: TypeModifier<ListType> =
{
  getOption: ({ registry, type, typeSettings, parent }) => {

    if (!(type instanceof SetType) && !(type instanceof MapType)) {
      return false;
    }

    const item = type.options.value;
    const subSettings = typeSettings.sub
      ? 'value' in typeSettings.sub
        ? typeSettings.sub.value
        : null
      : null;

    if (!subSettings) {
      return false;
    }

    return {
      text: 'Convert to List',
      description: 'This type will be converted to a list with the given values',
      priority: 14,
      value: async () => {
        if (!await getConfirmation({ pref: PREF_LIST_MODIFIER })) {
          return false;
        }

        const newType = ListType.forItem(item);

        const result = await getProgram({
          title: 'Convert to List',
          message: 'The expression that changes the type to a list.',
          confirm: 'Convert',
          registry,
          context: Types.object({
            parent: parent || NullType.baseType,
            value: type,
          }),
          program: Exprs.cast(type, newType),
          expectedType: newType,
        });

        if (!result) {
          return false;
        }

        const input = typeSettings.input in ListVisuals.inputs
          ? typeSettings.input
          : 'list';
        const options = typeSettings.input in ListVisuals.inputs
          ? typeSettings.options
          : ListListInput.getDefaultOptions();
        const sub = { item: subSettings };

        return {
          type: newType,
          settings: {
            input,
            defaultValue: [],
            options,
            sub,
          },
          transform: result.program,
        };
      },
    };
  },
};
