
import { ListType, AnyType, TextType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { ListListInput, ListListSubs } from './ListListTypes';
import { ListComboInput } from './ListComboTypes';
import { TextBoxInput } from '../text/TextBoxTypes';
import ListEditor from './ListEditor.vue';


const ListVisuals: TypeVisuals<ListType, true, false, ListListSubs> =
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
  inputsOrder: ['list', 'combo'],
  inputs: {
    list: ListListInput,
    combo: ListComboInput,
  },
};

export default ListVisuals;
