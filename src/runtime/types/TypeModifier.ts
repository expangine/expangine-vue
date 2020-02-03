
import { Type } from 'expangine-runtime';
import { TypeUpdateEvent, TypeSettings } from './TypeVisuals';
import { Registry } from '../Registry';


export interface TypeModifyInput
{
  registry: Registry;
  parent?: Type;
  type: Type;
  typeSettings: TypeSettings;
  noTransform?: boolean;
}

export type TypeModifyHandler<T extends Type = Type> = () => Promise<TypeUpdateEvent | false>;

export interface TypeModifyOption<T extends Type = Type>
{
  text: string;
  description?: string;
  value: TypeModifyHandler<T>;
  priority: number;
}

export interface TypeModifier<T extends Type = Type>
{
  getOption: (input: TypeModifyInput) => TypeModifyOption<T> | false;
}
