
import { AliasedType, ObjectType, copy, objectToArray, objectValues } from 'expangine-runtime';
import { createVisuals } from '@/runtime/types/TypeVisuals';
import { AliasedInput } from './AliasedTypes';
import { TypeModifier } from '../TypeModifier';
import { TypeBuilder } from '../TypeBuilder';
import { getEditAliased } from '@/app/EditAliased';
import { getSimpleInput } from '@/app/SimpleInput';
import AliasedEditor from './AliasedEditor.vue';



export const AliasedVisuals = createVisuals()({
  type: AliasedType,
  name: 'Custom Type',
  description: 'Custom type',
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
  editor: AliasedEditor,
  defaultInput: 'aliased',
  inputsOrder: ['aliased'],
  inputs: { 
    aliased: AliasedInput,
  },
});

export const AliasedModifier: TypeModifier = 
{
  getOption: ({ registry, type, typeSettings }) => {
    if (type.getId() !== ObjectType.id || !(type instanceof ObjectType)) {
      return false;
    }

    return {
      text: 'Add to Types',
      description: 'Create as custom re-usable type.',
      priority: 1,
      value: async () => {
        await getEditAliased({
          registry,
          type: type.clone(),
          settings: copy(typeSettings),
        });

        return false;
      },
    };
  },
};

export const AliasedBuilder: TypeBuilder =
{
  getOption: ({ registry }) => {
    const typeOptions = objectToArray(registry.defs.aliased, (_, value) => ({
      text: value,
      value,
    }));

    if (typeOptions.length === 0) {
      return false;
    }
    
    return {
      text: 'Type',
      description: 'A user-defined type',
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
          type: new AliasedType(typeName.type, registry.defs),
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
