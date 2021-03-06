
import { MapType } from 'expangine-runtime';
import { TypeVisualInput } from '@/runtime/types/TypeVisuals';
import { MapSubs } from './MapTypes';
import MapGrid from './MapGrid.vue';
import MapGridSettings from './MapGridSettings.vue';



export interface MapGridOptions
{
  title?: string;
  minKeyWidth: number;
  minValueWidth: number;
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

export const MapGridInput: TypeVisualInput<MapType, MapGridOptions, MapSubs> = 
{
  name: 'Grid',
  description: 'A grid allows you to control how many columns and rows a Map takes up.',
  input: MapGrid,
  settings: MapGridSettings,
  getComplexity: () => 2,
  isVisible: () => true,
  getDefaultOptions: () => ({
    minKeyWidth: 300,
    minValueWidth: 300,
    pageSize: 10,
    pagination: {},
  }),
  getName: (options) => options.title,
  getSummary: (options) => (
    `<strong>Grid</strong>: ${options.title || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
