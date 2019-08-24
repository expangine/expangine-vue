
import { ListType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import ListList from './ListList.vue';
import ListListSettings from './ListListSettings.vue';


export interface ListListOptions
{
  title: string;
  addLabel: string;
  removeLabel: string;
}

export type ListListSubs = 'item';

export const ListListInput: TypeVisualInput<ListType, ListListOptions, ListListSubs> = 
{
  name: 'List',
  description: 'A list allows multiple values of a given type.',
  input: ListList,
  settings: ListListSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    title: '',
    addLabel: 'Add Item',
    removeLabel: 'Remove Item',
  }),
  getName: () => '',
  getSummary: () => (
    `<strong>List</strong>`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
};
