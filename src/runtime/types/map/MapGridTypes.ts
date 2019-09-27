
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
}

export const MapGridInput: TypeVisualInput<MapType, MapGridOptions, MapSubs> = 
{
  name: 'Grid',
  description: 'A grid allows you to control how many columns and rows a Map takes up.',
  input: MapGrid,
  settings: MapGridSettings,
  isVisible: () => true,
  getDefaultOptions: () => ({
    minKeyWidth: 300,
    minValueWidth: 300,
  }),
  getName: (options) => options.title,
  getSummary: (options) => (
    `<strong>Grid</strong>: ${options.title || ''}`
  ),
  onSubAdd: () => { /**/ },
  onSubRemove: () => { /**/ },
  onSubMove: () => { /**/ },
};
