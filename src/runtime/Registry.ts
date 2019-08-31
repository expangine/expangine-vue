
import { Type, Definitions } from 'expangine-runtime';
import { TypeVisuals } from './TypeVisuals';
import { ListOptions, ListOptionsPriority } from '@/common';
import { TypeBuilder, TypeBuildInput, TypeBuildHandler } from './TypeBuilder';
import { TypeModifier, TypeModifyInput, TypeModifyHandler } from './TypeModifier';
import { TypeHook, TypeHookHandler, TypeHookInput } from './TypeHook';


export class Registry
{
  
  public defs: Definitions;
  public typeMap: Record<string, TypeVisuals>;
  public types: TypeVisuals[];
  public builders: TypeBuilder[];
  public modifiers: TypeModifier[];
  public hooks: TypeHook[];

  public constructor(defs: Definitions)
  {
    this.defs = defs;
    this.typeMap = Object.create(null);
    this.types = [];
    this.builders = [];
    this.modifiers = [];
    this.hooks = [];
  }

  public addBuilder<T extends Type = Type>(builder: TypeBuilder<T>): this
  {
    this.builders.push(builder);

    return this;
  }

  public addModifier<T extends Type = Type>(modifier: TypeModifier<T>): this
  {
    this.modifiers.push(modifier);

    return this;
  }

  public addHook(hook: TypeHook): this
  {
    this.hooks.push(hook);

    return this;
  }

  public addType(type: TypeVisuals<any, any, any>): this
  {
    this.typeMap[type.type.id] = type;
    this.types.push(type);

    return this;
  }

  public getVisuals<T extends Type>(type: T): TypeVisuals<T>
  {
    return this.typeMap[type.getId()] as unknown as TypeVisuals<T>;
  }

  public getTypeBuildersFor(input: TypeBuildInput): ListOptions<TypeBuildHandler>
  {
    const out: ListOptionsPriority<TypeBuildHandler> = [];

    for (const builder of this.builders) {
      const option = builder.getOption(input);

      if (option) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

  public getTypeModifiersFor(input: TypeModifyInput): ListOptions<TypeModifyHandler>
  {
    const out: ListOptionsPriority<TypeModifyHandler> = [];

    for (const modifier of this.modifiers) {
      const option = modifier.getOption(input);

      if (option) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

  public getTypeHooksFor(input: TypeHookInput): ListOptions<TypeHookHandler>
  {
    const out: ListOptionsPriority<TypeHookHandler> = [];

    for (const hook of this.hooks) {
      const option = hook.getOption(input);

      if (option) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

}
