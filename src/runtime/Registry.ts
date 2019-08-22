
import { Type } from 'expangine-runtime';
import { TypeVisuals, TypeSettings } from './TypeVisuals';
import { ListOptions } from '@/common';


export class Registry
{
  
  public types: Record<string, TypeVisuals>;

  public constructor()
  {
    this.types = Object.create(null);
  }

  public addType(type: TypeVisuals<any, any, any>): this
  {
    this.types[type.type.id] = type;

    return this;
  }

  public getVisuals<T extends Type>(type: T): TypeVisuals<T>
  {
    return this.types[type.getId()] as unknown as TypeVisuals<T>;
  }

  public getBuildableTypeOptions(exclude?: Record<string, any>): ListOptions<TypeVisuals>
  {
    const out: ListOptions<TypeVisuals> = [];
    const types = this.types;

    for (const prop in types)
    {
      const value = types[prop];

      if (value.buildable && (!exclude || !exclude[value.type.id]))
      {
        out.push({ text: value.buildLabel, value });
      }
    }

    return out;
  }

}
