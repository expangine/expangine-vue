import { Registry } from './Registry';
import { Type } from 'expangine-runtime';
import { TypeSettings } from './TypeVisuals';


export interface TypeHookInput
{
  registry: Registry;
  parent?: Type;
  parentSettings?: TypeSettings;
  type?: Type;
  typeSettings?: TypeSettings;
  readOnly?: boolean;
}
export type TypeHookHandler = () => Promise<void>;

export interface TypeHookOption
{
  text: string;
  description?: string;
  priority: number;
  value: TypeHookHandler;
}

export interface TypeHook
{
  getOption: (input: TypeHookInput) => TypeHookOption | false;
}
