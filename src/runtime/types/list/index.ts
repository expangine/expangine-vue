
import { ListType, AnyType, TextType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { ListSubs } from './ListTypes';
import { TextBoxInput } from '../text/TextBoxTypes';
import { ListListInput } from './ListListTypes';
import { ListComboInput } from './ListComboTypes';
import { ListEnumSelectInput } from './ListEnumSelectTypes';
import ListEditor from './ListEditor.vue';


const ListVisuals: TypeVisuals<ListType, true, false, ListSubs> =
{
  type: ListType,
  newInstance: () => ListType.forItem(new AnyType({ })),
  name: 'List',
  description: 'A list of values.',
  editor: ListEditor,
  buildable: true,
  buildLabel: 'List',
  onBuild: async () => ({
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
  defaultInput: 'list',
  inputsOrder: ['list', 'combo', 'select'],
  inputs: {
    list: ListListInput,
    combo: ListComboInput,
    select: ListEnumSelectInput,
  },
};

export default ListVisuals;
