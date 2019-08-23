
import { Type } from 'expangine-runtime';
import { TypeVisuals, TypeSettings } from './TypeVisuals';
import { ListOptions } from '@/common';


export class Registry
{
  
  public typeMap: Record<string, TypeVisuals>;
  public types: TypeVisuals[];

  public constructor()
  {
    this.typeMap = Object.create(null);
    this.types = [];
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

  public getBuildableTypeOptions(exclude?: Record<string, any>): ListOptions<TypeVisuals<any, true, any>>
  {
    const out: ListOptions<TypeVisuals<any, true, any>> = [];
    const types = this.types;

    for (const value of types)
    {
      if (value.buildable && (!exclude || !exclude[value.type.id]))
      {
        out.push({ text: value.buildLabel, value });
      }
    }

    return out;
  }

  public getModifiableTypeOptions(forType: Type, parent?: Type): ListOptions<TypeVisuals<any, any, true>>
  {
    const out: ListOptions<TypeVisuals<any, any, true>> = [];
    const types = this.types;

    for (const value of types)
    {
      if (value.modifiable && value.canModify(forType, parent))
      {
        out.push({ text: value.modifyLabel, value });
      }
    }

    return out;
  }

}
