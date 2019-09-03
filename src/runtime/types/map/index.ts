
import { Type, MapType, TextType, ObjectType, ManyType, AnyType, OperationExpression, MapOps } from 'expangine-runtime';
import { getConfirmation } from '@/app/Confirm';
import { TypeSettings, createVisuals } from '@/runtime/TypeVisuals';
import { TypeBuilder, TypeBuilderWrapper } from '@/runtime/TypeBuilder';
import { TypeModifier } from '@/runtime/TypeModifier';
import { MapGridInput } from './MapGridTypes';
import { TextBoxInput } from '../text/TextBoxTypes';
import { TextComboInput } from '../text/TextComboTypes';
import MapEditor from './MapEditor.vue';


export const MapVisuals = createVisuals({
  type: MapType,
  name: 'Map',
  description: 'A collection of key-value pairs.',
  create: () => OperationExpression.create(MapOps.create, {}),
  editor: MapEditor,
  defaultInput: 'grid',
  inputsOrder: ['grid'],
  inputs: {
    grid: MapGridInput,
  },
});

export const MapBuilder: TypeBuilder<MapType> = 
{
  getOption: () => ({
    text: 'Map',
    description: 'A dictionary of key-value pairs',
    priority: 8,
    value: async () => ({
      type: MapType.forItem(new TextType({}), new TextType({})),
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
          value: { 
            input: 'textbox', 
            defaultValue: '',
            options: {
              ...TextBoxInput.getDefaultOptions(), 
              label: 'Value',
            },
          },
        },
      },
    }),
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
          const manyVisual = registry.getVisuals(valueType);
          value = {
            input: manyVisual.defaultInput as string,
            defaultValue: undefined,
            options: undefined,
            sub: propSettings,
          };
        }

        return {
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
        };
      },
    };
  },
};

export const MapBuilderWrapper: TypeBuilderWrapper =
{
  getOption: () => ({
    text: 'Map of...',
    priority: 3,
    value: async ([{ type, settings }]) => ({
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
    }),
  }),
};
