
import { VueConstructor } from 'vue';
import { Type, TypeClass } from 'expangine-runtime';

export interface TypeBuildable
{
  buildable: true;
  buildLabel: string;
  onBuild: (parent?: Type, parentSettings?: TypeSettings<any>) => { type: Type, settings: TypeSettings<any> };
}

export interface TypeNotBuildable
{
  buildable?: false;
}

export interface TypeModifiable
{
  modifiable: true;
  modifyLabel: string;
  onModify: (type?: Type, settings?: TypeSettings<any>) => { type: Type, settings: TypeSettings<any> };
}

export interface TypeNotModifiable
{
  modifiable?: false;
}

export interface TypeVisualRequired<T extends Type, OptionMap = any>
{
  type: TypeClass<T>;
  newInstance: () => T;
  name: string;
  description: string;
  editor: VueConstructor;
  defaultInput: string;
  allowsDefault?: boolean;
  inputsOrder: Array<keyof OptionMap>;
  inputs: {
    [P in keyof OptionMap]: TypeVisualInput<T, OptionMap[P]>;
  };
}

export interface TypeVisualInput<T extends Type, Options>
{
  name: string;
  description: string;
  settings: VueConstructor;
  input: VueConstructor;
  isVisible: (type: T) => boolean;
  getSummary: (options: Options) => string;
  getDefaultOptions: () => Options;
}

export type TypeVisuals<
  T extends Type = Type,
  Build extends boolean = any, 
  Modify extends boolean = any
> = 
  TypeVisualRequired<T>
  & (Build extends true ? TypeBuildable : TypeNotBuildable)
  & (Modify extends true ? TypeModifiable : TypeNotModifiable)
;

export interface TypeSettings<Options>
{ 
  input: string;
  options: Options;
  defaultValue: any;
  sub?: Record<string, TypeSettings<any>>;
}
