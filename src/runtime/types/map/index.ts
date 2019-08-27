
import { MapType, TextType, ObjectType } from 'expangine-runtime';
import { TypeVisuals } from '@/runtime/TypeVisuals';
import { TextBoxInput } from '../text/TextBoxTypes';
import { MapSubs } from './MapTypes';
import { MapGridInput } from './MapGridTypes';
import MapEditor from './MapEditor.vue';


const MapVisuals: TypeVisuals<MapType, true, true, MapSubs> =
{
  type: MapType,
  newInstance: () => MapType.forItem(new TextType({}), new TextType({})),
  name: 'Map',
  description: 'A collection of key-value pairs.',
  editor: MapEditor,
  modifiable: true,
  modifyLabel: 'Convert to Map',
  canModify: (type, parent) => type instanceof ObjectType,
  onModify: async (type, settings) => {
    throw new Error('Not yet implemented');
  },
  buildable: true,
  buildLabel: 'Map',
  onBuild: async () => ({
    type: MapType.forItem(new TextType({}), new TextType({})),
    settings: {
      input: 'grid',
      defaultValue: [],
      options: MapGridInput.getDefaultOptions(),
      sub: {
        key: { 
          input: 'textbox', 
          defaultValue: '',
          options: TextBoxInput.getDefaultOptions(), 
        },
        value: { 
          input: 'textbox', 
          defaultValue: '',
          options: TextBoxInput.getDefaultOptions(), 
        },
      },
    },
  }),
  defaultInput: 'grid',
  inputsOrder: ['grid'],
  inputs: {
    grid: MapGridInput,
  },
};

export default MapVisuals;
