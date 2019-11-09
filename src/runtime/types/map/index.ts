
import { Type, MapType, TextType, ObjectType, ManyType, isString, isMap, toArray} from 'expangine-runtime';
import { getConfirmation } from '@/app/Confirm';
import { TypeSettings, createVisuals, TypeSubNode } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { initializeSubs, isExactType } from '@/common';
import { MapGridInput } from './MapGridTypes';
import { TextBoxInput } from '../text/TextBoxTypes';
import { TextComboInput } from '../text/TextComboTypes';
import { MapSubs } from './MapTypes';
import MapEditor from './MapEditor.vue';



export const MapVisuals = createVisuals<MapSubs>()({
  type: MapType,
  name: 'Map',
  description: 'A collection of key-value pairs.',
  describe: ({registry, type}) => 'Map of ' + registry.getTypeDescribe(type.options.key) + ' to ' + registry.getTypeDescribe(type.options.value),
  describeLong: (registry, type, padding, tab, newline) => 
    'Map {' + newline +
    padding + tab + 'key:' + registry.getTypeDescribeLong(type.options.key, tab, newline, padding + tab) + newline +
    padding + tab + 'value:' + registry.getTypeDescribeLong(type.options.value, tab, newline, padding + tab) + newline +
    padding + '}'
  ,
  stringify: ({ registry, value, type }) => 
    'new Map([' + 
      toArray((value as Map<any, any>).entries()).map(([k, v]) => 
        '[' + 
          registry.getTypeStringify(type.options.key, k) + 
          ',' + 
          registry.getTypeStringify(type.options.value, v) + 
        ']',
      ).join(',') + 
    '])',
  toString: ({ registry, value, type, tab, newline, padding, process, processInvalid }) => {
    if (!isMap(value)) {
      return processInvalid(value, type);
    }
    const processed = process(value, type);
    if (isString(processed)) {
      return processed;
    }

    let out = 'Map {' + newline;

    for (const [mapKey, mapValue] of value.entries()) {
      out += padding + tab;
      out += registry.getTypeToString(mapKey, type.options.key, tab, newline, padding + tab, process, processInvalid);
      out += ' => ';
      out += registry.getTypeToString(mapValue, type.options.value, tab, newline, padding + tab, process, processInvalid);
      out += newline;
    }

    out += padding + '}';

    return out;
  },
  subNodes: ({ type, value }) => {
    const nodes: TypeSubNode[] = [];
    for (const [mapKey, mapValue] of value.entries()) {
      nodes.push({
        sub: mapKey,
        subType: type.options.key,
        value: mapValue,
        valueType: type.options.value,
      });
    }
    return nodes;
  },
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = '[ key ]';
    const description = 'A ' + registry.getTypeDescribeLong(type.options.value, '', '  ') + ' with a given ' + registry.getTypeDescribeLong(type.options.key, '', '  ') + ' key';

    return { key, value, text, description };
  }),
  subSettings: (registry, type, settings, sub, forKey) => {
    return forKey
      ? settings.sub.key
      : settings.sub.value;
  },
  settingsFor: ({ registry, type, sub }) => ({ 
    input: 'grid', 
    defaultValue: [], 
    options: { ...MapGridInput.getDefaultOptions(), ...registry.settingsOverrides, label: sub + '' }, 
    sub: {
      key: registry.getTypeSettings(type.options.key, 'Key'), 
      value: registry.getTypeSettings(type.options.value, sub), 
    },
  }),
  editor: MapEditor,
  defaultInput: 'grid',
  inputsOrder: ['grid'],
  inputs: {
    grid: MapGridInput,
  },
});

export const MapBuilder: TypeBuilder = 
{
  getOption: ({ registry, existingType, existingSettings }) => ({
    text: 'Map',
    description: 'A dictionary of key-value pairs',
    priority: 8,
    value: async () => (initializeSubs(registry, {
      type: MapType.forItem(existingType || new TextType({}), new TextType({})),
      settings: {
        input: 'grid',
        defaultValue: [],
        options: MapGridInput.getDefaultOptions(),
        sub: {
          key: { 
            input: 'textbox', 
            defaultValue: '',
            options: {
              ...TextBoxInput.getDefaultOptions(),
              label: 'Key',
            }, 
          },
          value: existingSettings || { 
            input: 'textbox', 
            defaultValue: '',
            options: {
              ...TextBoxInput.getDefaultOptions(), 
              label: 'Value',
            },
          },
        },
      },
    })),
  }),
};

export const MapModifierFromObject: TypeModifier<MapType> = 
{
  getOption:  (input) => {
    const { registry, type, typeSettings } = input;

    if (!isExactType(type, ObjectType)) {
      return false;
    }

    const settings = typeSettings as TypeSettings<any, string>;

    return {
      text: 'Convert to Map',
      description: 'The value will be a many type and the key will be text',
      priority: 3,
      value: async () => {
        if (!await getConfirmation()) {
          return false;
        }
    
        const props = type.options.props;
        const propNames: string[] = [];
        const propTypes: Type[] = [];
        const propSettings: Array<TypeSettings<any, any>> = [];
        
        for (const prop in props) {
          const propType = props[prop];
          propNames.push(prop);
          propTypes.push(propType);
          propSettings.push(settings.sub[prop]);
        }
    
        let valueType: Type = new ManyType(propTypes);
        let value: TypeSettings<any, any>;
    
        if (propTypes.length === 0) {
          valueType = propTypes[0];
          value = propSettings[0];
        } else {
          const manyVisual = registry.getTypeVisuals(valueType);
          value = {
            input: manyVisual.defaultInput as string,
            defaultValue: undefined,
            options: undefined,
            sub: propSettings,
          };
        }

        return initializeSubs(registry, {
          type: MapType.forItem(valueType, new TextType({})),
          settings: {
            input: 'grid',
            defaultValue: [],
            options: MapGridInput.getDefaultOptions(),
            sub: {
              key: {
                input: 'combo',
                defaultValue: '',
                options: {
                  ...TextComboInput.getDefaultOptions(),
                  label: 'Key',
                  items: propNames,
                },
              },
              value,
            },
          },
        });
      },
    };
  },
};

export const MapBuilderWrapper: TypeBuilderWrapper =
{
  getOption: ({ registry }) => ({
    text: 'Map of...',
    priority: 3,
    value: async ([{ type, settings }]) => (initializeSubs(registry, {
      type: MapType.forItem(type, new TextType({})),
      settings: {
        input: 'grid',
        defaultValue: [],
        options: MapGridInput.getDefaultOptions(),
        sub: {
          key: { 
            input: 'textbox', 
            defaultValue: '',
            options: {
              ...TextBoxInput.getDefaultOptions(),
              label: 'Key',
            }, 
          },
          value: settings,
        },
      },
    })),
  }),
};
