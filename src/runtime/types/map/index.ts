
import { Type, MapType, TextType, ObjectType, ManyType, MapOps, ExpressionBuilder, ListOps} from 'expangine-runtime';
import { getConfirmation } from '@/app/Confirm';
import { TypeSettings, createVisuals } from '@/runtime/types/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/types/TypeBuilder';
import { TypeModifier } from '@/runtime/types/TypeModifier';
import { MapGridInput } from './MapGridTypes';
import { TextBoxInput } from '../text/TextBoxTypes';
import { TextComboInput } from '../text/TextComboTypes';
import MapEditor from './MapEditor.vue';
import { initializeSubs } from '@/common';


const ex = new ExpressionBuilder();

export const MapVisuals = createVisuals({
  type: MapType,
  name: 'Map',
  description: 'A collection of key-value pairs.',
  describe: (registry, type) => 'Map of ' + registry.getTypeDescribe(type.options.key) + ' to ' + registry.getTypeDescribe(type.options.value),
  subOptions: (registry, type) => type.getSubTypes(registry.defs).map(({ key, value }) => {
    const text = '[ key ]';
    const description = 'A ' + registry.getTypeDescribe(type.options.value) + ' with a given ' + registry.getTypeDescribe(type.options.key) + ' key';

    return { key, value, text, description };
  }),
  exprs: {
    create: () => ex.op(MapOps.create, {}),
    valid: (registry, type) => ex.and(
      ex.op(MapOps.isValid, {
        value: ex.get('value'),
      }),
      ex.not(ex.op(ListOps.contains, {
        list: ex.op(MapOps.values, { map: ex.get('value') }),
        item: ex.const(null),
        isEqual: ex.not(registry.getTypeValid(type.options.value)),
      }, {
        value: 'ignore',
        test: 'value',
      })),
      ex.not(ex.op(ListOps.contains, {
        list: ex.op(MapOps.keys, { map: ex.get('value') }),
        item: ex.const(null),
        isEqual: ex.not(registry.getTypeValid(type.options.key)),
      }, {
        value: 'ignore',
        test: 'value',
      })),
    ),
    compare: (registry, type) => ex.op(MapOps.cmp, {
      value: ex.get('value'),
      test: ex.get('test'),
      compare: registry.getTypeCompare(type.options.value),
    }),
  },
  editor: MapEditor,
  defaultInput: 'grid',
  inputsOrder: ['grid'],
  inputs: {
    grid: MapGridInput,
  },
});

export const MapBuilder: TypeBuilder<MapType> = 
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

    if (!(type instanceof ObjectType)) {
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
          kind: 'change',
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
