
import { ListType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListList from './ListList.vue';
import ListListSettings from './ListListSettings.vue';


export interface ListListOptions
{
  title?: string;
  itemName?: string;
  hideRemove?: boolean;
  hideInsert?: boolean;
  hideSort?: boolean;
  paging?: boolean;
  pageSize: number;
  pagination: {
    circle?: boolean;
    color?: string;
    dark?: boolean;
    nextIcon?: string;
    prevIcon?: string;
    totalVisible?: number;
  };
}

export const ListListInput: TypeVisualInput<ListType, ListListOptions, ListSubs> = 
{
  name: 'List',
  description: 'A list allows multiple values of a given type.',
  input: ListList,
  settings: ListListSettings,
  getComplexity: () => 2,
  isVisible: () => true,
  getDefaultOptions: () => ({ pageSize: 10, pagination: {} }),
  getName: (options) => options.title || options.itemName,
  getSummary: (options) => (
    `<strong>List</strong>: ${options.title || options.itemName || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
