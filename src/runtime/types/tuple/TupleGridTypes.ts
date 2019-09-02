
import { TupleType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/TypeVisuals';
import { TupleSubs } from './TupleTypes';
import TupleGrid from './TupleGrid.vue';
import TupleGridSettings from './TupleGridSettings.vue';


export interface TupleGridOptions
{
  title?: string;
  columns: Array<{
    cols: number | string;
    sm?: number | string;
    md?: number | string;
    lg?: number | string;
    xl?: number | string;
    offset?: number | string;
    offsetSm?: number | string;
    offsetMd?: number | string;
    offsetLg?: number | string;
    offsetXl?: number | string;
  }>;
}

export const TupleGridInput: TypeVisualInput<TupleType, TupleGridOptions, TupleSubs> = 
{
  name: 'Grid',
  description: 'A grid allows you to determine how much space each type has for each resolution.',
  input: TupleGrid,
  settings: TupleGridSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    columns: [],
  }),
  getName: (options) => options.title,
  getSummary: (options) => (
    `<strong>Grid</strong>: ${options.title}`
  ),
  onSubAdd: (prop, type, settings) => {
    settings.options.columns.splice(prop, 0, { cols: 12 });
  },
  onSubRemove: (prop, type, settings) => {
    settings.options.columns.splice(prop, 1);
  },
  onSubMove: (prop, newProp, type, settings) => {
    const columns = settings.options.columns;
    const temp = columns[prop];
    columns[prop] = columns[newProp];
    columns[newProp] = temp;
  },
};
