import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { Registry } from '@/runtime/Registry';
import { EntityType, objectToArray } from 'expangine-runtime';
import { friendlyList } from '@/common';


export const entityBuilders: Record<string, TypeBuilder> = {};

export function renameEntity(registry: Registry, name: string, newName: string)
{
  removeEntity(registry, name);
  addEntity(registry, newName);
}

export function clearEntity(registry: Registry)
{
  for (const entityName in entityBuilders)
  {
    removeEntity(registry, entityName);
  }
}

export function removeEntity(registry: Registry, name: string)
{
  const builder = entityBuilders[name];

  if (builder)
  {
    const i = registry.typeBuilders.indexOf(builder);

    if (i !== -1)
    {
      registry.typeBuilders.splice(i, 1);
    }

    delete entityBuilders[name];
  }
}

export function addEntity(registry: Registry, name: string)
{
  removeEntity(registry, name);

  const aliased = registry.defs.getEntity(name);

  const builder: TypeBuilder = {
    getOption: () => ({
      text: name,
      description: aliased
        ? friendlyList(objectToArray(aliased.type.options.props, (_, key) => key as string))
        : 'The user-defined type',
      priority: 100,
      value: async () => ({
        type: new EntityType(name, registry.defs),
        settings: {
          input: 'aliased',
          options: {},
          defaultValue: {},
        },
      }),
    }),
  };

  entityBuilders[name] = builder;

  registry.addTypeBuilder(builder);
}
