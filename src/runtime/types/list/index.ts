
import { ListType, TextType, isString, isArray, ObjectType, objectReduce, objectValues } from 'expangine-runtime';
import { createVisuals, TypeSettings } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TextBoxInput } from '../text/TextBoxTypes';
import { ListListInput } from './ListListTypes';
import { ListComboInput } from './ListComboTypes';
import { ListEnumSelectInput } from './ListEnumSelectTypes';
import { ListEnumAutocompleteInput } from './ListEnumAutocompleteTypes';
import { ListEnumCheckboxInput } from './ListEnumCheckboxTypes';
import { ListObjectTableInput } from './ListObjectTableTypes';
import ListEditor from './ListEditor.vue';
import ListOptions from './ListOptions.vue';
import { initializeSubs } from '@/common';
import { ListSubs } from './ListTypes';


export const ListVisuals = createVisuals<ListSubs>()({
  type: ListType,
  name: 'List',
  description: 'A list of values.',
  describe: ({registry, type}) => 'List of ' + registry.getTypeDescribe(type.options.item),
  describeLong: (registry, type, padding, tab, newline) => 
    'List of ' + registry.getTypeDescribeLong(type.options.item, tab, newline, padding)
  ,
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
    subType: ListType.indexType,
    value: item,
    valueType: type.options.item,
  })),
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = key === 'length'
      ? 'length'
      : '[ index ]';
    const description = key === 'length'
      ? 'The number of items in the list'
      : registry.getTypeDescribeLong(type.options.item, '', '  ') + ' at a given index';

    return { key, value, text, description };
  }),
  subSettings: (registry, type, settings, sub, forKey) => {
    return !forKey && sub.key === ListType.indexType
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
  inputsOrder: ['list', 'combo', 'select', 'autocomplete', 'checkbox', 'table'],
  inputs: {
    list: ListListInput,
    combo: ListComboInput,
    select: ListEnumSelectInput,
    autocomplete: ListEnumAutocompleteInput,
    checkbox: ListEnumCheckboxInput,
    table: ListObjectTableInput,
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
