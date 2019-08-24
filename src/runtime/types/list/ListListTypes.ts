
import { ListType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import ListList from './ListList.vue';
import ListListSettings from './ListListSettings.vue';


export interface ListListOptions
{
  title: string;
  itemName: string;
  hideRemove: boolean;
  hideInsert: boolean;
  hideSort: boolean;
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
    itemName: 'Item',
    hideRemove: false,
    hideInsert: false,
    hideSort: false,
  }),
  getName: () => '',
  getSummary: () => (
    `<strong>List</strong>`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
};
