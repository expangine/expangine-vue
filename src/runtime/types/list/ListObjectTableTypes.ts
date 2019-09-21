
import { ListType, ObjectType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListObjectTable from './ListObjectTable.vue';
import ListObjectTableSettings from './ListObjectTableSettings.vue';


export interface ListObjectTableOptions
{
  title?: string;
  itemName?: string;
  hideRemove?: boolean;
  hideInsert?: boolean;
  hideSort?: boolean;
  dark?: boolean;
  dense?: boolean;
  fixedHeader?: boolean;
  height?: number;
  paging?: boolean;
  pageSize: number;
  columns: Array<{
    align?: 'left' | 'right' | 'center';
    label: string;
    prop: string;
  }>;
  pagination: {
    circle?: boolean;
    color?: string;
    dark?: boolean;
    nextIcon?: string;
    prevIcon?: string;
    totalVisible?: number;
  };
}

export const ListObjectTableInput: TypeVisualInput<ListType, ListObjectTableOptions, ListSubs> = 
{
  name: 'Table',
  description: 'A table with columns for each object property.',
  hideSubSettings: true,
  input: ListObjectTable,
  settings: ListObjectTableSettings,
  isVisible: (type) => type.options.item instanceof ObjectType,
  getDefaultOptions: () => ({
    columns: [],
    pageSize: 10,
    pagination: {},
  }),
  getName: (options) => options.title || options.itemName,
  getSummary: (options) => (
    `<strong>Table</strong>: ${options.title || options.itemName || ''}`
  ),
  onSubAdd: (prop, type, settings) => {
    const columns = settings.options.columns;
    const index = columns.findIndex((v) => v.prop === prop);
    if (index === -1) {
      columns.push({ prop, label: prop });
    }
  },
  onSubRemove: (prop, type, settings) => {
    const columns = settings.options.columns;
    const index = columns.findIndex((v) => v.prop === prop);
    if (index !== -1) {
      columns.splice(index, 1);
    }
  },
  onSubMove: (prop, newProp, type, settings) => {
    const columns = settings.options.columns;
    const index = columns.findIndex((v) => v.prop === prop);
    if (index !== -1) {
      columns[index].prop = newProp;
    }
  },
};
