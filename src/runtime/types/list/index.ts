
import { ListType, TextType, ListOps, OperationExpression, GetExpression, ExpressionBuilder } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/TypeBuilder';
import { TextBoxInput } from '../text/TextBoxTypes';
import { ListListInput } from './ListListTypes';
import { ListComboInput } from './ListComboTypes';
import { ListEnumSelectInput } from './ListEnumSelectTypes';
import { ListEnumAutocompleteInput } from './ListEnumAutocompleteTypes';
import { ListEnumCheckboxInput } from './ListEnumCheckboxTypes';
import ListEditor from './ListEditor.vue';
import ListOptions from './ListOptions.vue';
import { initializeSubs } from '@/common';


const ex = new ExpressionBuilder();

export const ListVisuals = createVisuals({
  type: ListType,
  name: 'List',
  description: 'A list of values.',
  create: () => ex.op(ListOps.create, {}),
  isValid: (registry, type) => ex.and(
    ex.op(ListOps.isValid, {
      value: ex.get('value'),
    }),
    ex.not(ex.op(ListOps.contains, {
      list: ex.get('value'),
      item: ex.const(null),
      isEqual: ex.not(registry.getIsValid(type.options.item)),
    }, {
      value: 'ignore',
      test: 'value',
    })),
  ),
  editor: ListEditor,
  options: ListOptions,
  defaultInput: 'list',
  inputsOrder: ['list', 'combo', 'select', 'autocomplete', 'checkbox'],
  inputs: {
    list: ListListInput,
    combo: ListComboInput,
    select: ListEnumSelectInput,
    autocomplete: ListEnumAutocompleteInput,
    checkbox: ListEnumCheckboxInput,
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
