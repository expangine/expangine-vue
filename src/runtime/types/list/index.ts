
import { ListType, TextType } from 'expangine-runtime';
import { createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder } from '@/runtime/TypeBuilder';
import { TextBoxInput } from '../text/TextBoxTypes';
import { ListListInput } from './ListListTypes';
import { ListComboInput } from './ListComboTypes';
import { ListEnumSelectInput } from './ListEnumSelectTypes';
import { ListEnumAutocompleteInput } from './ListEnumAutocompleteTypes';
import { ListEnumCheckboxInput } from './ListEnumCheckboxTypes';
import ListEditor from './ListEditor.vue';


export const ListVisuals = createVisuals({
  type: ListType,
  name: 'List',
  description: 'A list of values.',
  editor: ListEditor,
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
  getOption: () => ({
    text: 'List',
    priority: 4,
    value: async () => ({
      type: ListType.forItem(new TextType({ })),
      settings: {
        input: 'list',
        defaultValue: [],
        options: ListListInput.getDefaultOptions(),
        sub: { 
          item: { 
            input: 'textbox', 
            defaultValue: '',
            options: TextBoxInput.getDefaultOptions(), 
          },
        },
      },
    }),
  }),
};
