
import { EntityType, ObjectType, DataTypes, objectValues } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { EntityInput } from './EntityTypes';
import { EntityAutocompleteInput } from './EntityAutocompleteTypes';
import { TypeModifier } from '../TypeModifier';
import { TypeBuilder } from '../TypeBuilder';
import { getEditEntity } from '@/app/EditEntity';
import { getSimpleInput } from '@/app/SimpleInput';
import EntityEditor from './EntityEditor.vue';


export const EntityVisuals = createVisuals()({
  type: EntityType,
  name: (e) => e.options,
  description: 'Entity',
  describe: ({registry, type}) => type.options,
  describeLong: (registry, type, padding, tab, newline) => {
    const aliased = type.getType() as ObjectType;

    return aliased instanceof ObjectType
      ? type.options + ' {' + newline +
        objectValues(aliased.options.props, (propType, prop) => 
          propType
            ? padding + tab + prop + ': ' + registry.getTypeDescribeLong(propType, tab, newline, padding + tab) + newline
            : '',
        ).join('') +
        padding + '}'
      : type.options;
  },
  stringify: ({ registry, type, value }) => registry.getTypeStringify(type.getType(), value),
  toString: ({ value, type, process, registry, processInvalid, tab, newline, padding }) => registry.getTypeToString(value, type.getType(), tab, newline, padding, process, processInvalid ),
  subNodes: ({ value, type, registry }) => registry.getTypeSubNodes(value, type.getType()),
  subOptions: (registry, type) => registry.getTypeSubOptions(type.getType()),
  subSettings: (registry, type, settings, sub) => null,
  settingsFor: ({ registry, type }) => ({
    input: 'aliased',
    options: {},
    defaultValue: null,
  }),
  editor: EntityEditor,
  defaultInput: 'aliased',
  inputsOrder: ['aliased', 'autocomplete'],
  inputs: { 
    aliased: EntityInput,
    autocomplete: EntityAutocompleteInput,
  },
});

export const EntityModifier: TypeModifier = 
{
  getOption: ({ registry, type, typeSettings }) => {
    if (type.getId() !== ObjectType.id || !(type instanceof ObjectType)) {
      return false;
    }

    return {
      text: 'Add as Entity',
      description: 'Create as custom re-usable object',
      priority: 1,
      value: async () => {
        await getEditEntity({
          registry,
          type: type.clone(),
          settings: DataTypes.copy(typeSettings),
        });

        return false;
      },
    };
  },
};

export const EntityBuilder: TypeBuilder =
{
  getOption: ({ registry }) => {
    const typeOptions = registry.defs.entities.keys.map((entity) => ({
      text: entity,
      value: entity,
    }));

    if (typeOptions.length === 0) {
      return false;
    }
    
    return {
      text: 'Entity',
      description: 'A user-defined object',
      priority: 8,
      value: async () => {
        const typeName = await getSimpleInput({
          title: 'Type',
          value: { type: '' },
          fields: [
            { type: 'select', name: 'type', label: 'Type', items: typeOptions },
          ],
        });

        if (!typeName) {
          return false;
        }

        return {
          type: new EntityType(typeName.type, registry.defs),
          settings: {
            input: 'aliased', 
            options: {},
            defaultValue: null,
          },
        };
      },
    };
  },
};
