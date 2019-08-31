
import { Type } from 'expangine-runtime';
import { TypeSettings } from './TypeVisuals';
import { Registry } from './Registry';


export interface TypeBuildInput
{
  registry: Registry;
  parent?: Type;
  parentSettings?: TypeSettings;
  existingType?: Type;
  existingSettings?: TypeSettings;
}

export type TypeBuildHandler<T extends Type = Type> = () => Promise<TypeBuildResult<T> | false>;

export interface TypeBuildOption<T extends Type = Type>
{
  text: string;
  value: TypeBuildHandler<T>;
  priority: number;
}

export interface TypeBuilder<T extends Type = Type>
{
  getOption: (input: TypeBuildInput) => TypeBuildOption<T> | false;
}

export interface TypeBuildResult<T extends Type = Type>
{
  type: T;
  settings: TypeSettings;
}
