
import { Type, Expression } from 'expangine-runtime';
import { TypeSettings } from './TypeVisuals';
import { Registry } from './Registry';


export interface TypeModifyInput
{
  registry: Registry;
  parent?: Type;
  type: Type;
  typeSettings: TypeSettings;
}

export type TypeModifyHandler<T extends Type = Type> = () => Promise<TypeModifyResult<T> | false>;

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

export interface TypeModifyResult<T extends Type = Type>
{
  kind: 'change' | 'update';
  type: T;
  settings: TypeSettings;
  transform?: Expression;
}
