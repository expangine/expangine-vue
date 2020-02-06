import Vue from 'vue';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { Registry } from '@/runtime/Registry';
import { AliasedType, ObjectType, objectToArray } from 'expangine-runtime';
import { friendlyList } from '@/common';


export const typeBuilders: Record<string, TypeBuilder> = {};

export function renameType(registry: Registry, name: string, newName: string)
{
  removeType(registry, name);
  addType(registry, newName);
}

export function removeType(registry: Registry, name: string)
{
  const builder = typeBuilders[name];

  if (builder)
  {
    const i = registry.typeBuilders.indexOf(builder);

    if (i !== -1)
    {
      registry.typeBuilders.splice(i, 1);
    }
  }
}

export function addType(registry: Registry, name: string)
{
  removeType(registry, name);

  const aliased = registry.defs.getType(name);

  const builder: TypeBuilder = {
    getOption: () => ({
      text: name,
      description: aliased instanceof ObjectType
        ? friendlyList(objectToArray(aliased.options.props, (_, key) => key as string))
        : 'The user-defined type',
      priority: 100,
      value: async () => ({
        type: new AliasedType(name, registry.defs),
        settings: {
          input: 'aliased',
          options: {},
          defaultValue: {},
        },
      }),
    }),
  };

  typeBuilders[name] = builder;

  registry.addTypeBuilder(builder);
}
