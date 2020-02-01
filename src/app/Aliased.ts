import Vue from 'vue';
import { TypeBuilder } from '@/runtime/types/TypeBuilder';
import { Registry } from '@/runtime/Registry';
import { AliasedType } from 'expangine-runtime';


export const typeBuilders: Record<string, TypeBuilder> = {};

export function renameType(registry: Registry, name: string, newName: string)
{
  const builder = typeBuilders[name];
  const i = registry.typeBuilders.indexOf(builder);

  if (i !== -1)
  {
    registry.typeBuilders.splice(i, 1);
  }

  addType(registry, newName);
}

export function addType(registry: Registry, name: string)
{
  const builder: TypeBuilder = {
    getOption: () => ({
      text: name,
      description: 'The user-defined type',
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

  registry.addTypeBuilder(builder);
}
