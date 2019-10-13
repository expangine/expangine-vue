
import { ListType, TextType, ListOps, ExpressionBuilder, isNumber } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
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


const ex = new ExpressionBuilder();

export const ListVisuals = createVisuals({
  type: ListType,
  name: 'List',
  description: 'A list of values.',
  describe: ({registry, type}) => 'List of ' + registry.getTypeDescribe(type.options.item),
  describeLong: (registry, type, padding, tab, newline) => 
    'List of ' + registry.getTypeDescribeLong(type.options.item, tab, newline, padding + tab)
  ,
  toString: ({ registry, value, type, tab, newline, padding }) => 
    '[' + newline + 
    value.map((item: any) => padding + tab + registry.getTypeToString(item, type.options.item, tab, newline, padding + tab) + newline).join('') + 
    padding + ']'
  ,
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
  settingsFor: ({ registry, type, sub }) => ({ 
    input: 'list', 
    defaultValue: [], 
    options: { ...ListListInput.getDefaultOptions(), ...registry.settingsOverrides, title: sub }, 
    sub: { 
      item: registry.getTypeSettings(type.options.item, sub), 
    },
  }),
  exprs: {
    create: () => ex.op(ListOps.create, {}),
    valid: (registry, type) => ex.and(
      ex.op(ListOps.isValid, {
        value: ex.get('value'),
      }),
      ex.not(ex.op(ListOps.contains, {
        list: ex.get('value'),
        item: ex.const(null),
        isEqual: ex.not(registry.getTypeValid(type.options.item)),
      }, {
        value: 'ignore',
        test: 'value',
      })),
    ),
    compare: (registry, type) => ex.op(ListOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
      compare: registry.getTypeCompare(type),
    }),
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

export const ListBuilder: TypeBuilder<ListType> = 
{
  getOption: ({ registry, existingType, existingSettings }) => ({
    text: 'List',
    description: 'An collection/list/array of values',
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
