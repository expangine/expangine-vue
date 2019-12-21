
import { SetType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { SetSubs } from './SetTypes';
import SetList from './SetList.vue';
import SetListSettings from './SetListSettings.vue';


export interface SetListOptions
{
  title?: string;
  itemName?: string;
  hideRemove?: boolean;
  hideInsert?: boolean;
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

export const SetListInput: TypeVisualInput<SetType, SetListOptions, SetSubs> = 
{
  name: 'List',
  description: 'A list allows multiple values of a given type.',
  input: SetList,
  settings: SetListSettings,
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
