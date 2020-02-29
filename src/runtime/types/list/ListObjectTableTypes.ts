
import { ListType, ObjectType, EntityType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { ListSubs } from './ListTypes';
import ListObjectTable from './ListObjectTable.vue';
import ListObjectTableSettings from './ListObjectTableSettings.vue';
import { isExactType } from '@/common';


export interface ListObjectTableOptions
{
  title?: string;
  itemName?: string;
  hideRemove?: boolean;
  hideInsert?: boolean;
  hideSort?: boolean;
  hideExport?: boolean;
  hideImport?: boolean;
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
  getComplexity: () => 2,
  isVisible: (type) => isExactType(type.options.item, ObjectType) || type.options.item instanceof EntityType,
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
