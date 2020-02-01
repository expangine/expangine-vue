
import { AliasedType, ObjectType, copy, objectToArray } from 'expangine-runtime';
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
  describeLong: (registry, type, padding) => type.options,
  stringify: ({ registry, type, value }) => type.options,
  toString: ({ value, type, process, processInvalid }) => {
    return process(value, type);
  },
  subNodes: () => [],
  subOptions: (registry, type) => [],
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
