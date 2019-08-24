
import { VueConstructor } from 'vue';
import { Type, TypeClass } from 'expangine-runtime';

export type SubsType = string | unknown;

export interface TypeBuildable<Subs extends SubsType = unknown>
{
  buildable: true;
  buildLabel: string;
  onBuild: (parent?: Type, parentSettings?: TypeSettings<any, any>) => Promise<TypeAndSettings<any, Subs>>;
}

export interface TypeNotBuildable
{
  buildable?: false;
}

export interface TypeModifiable<Subs extends SubsType = unknown>
{
  modifiable: true;
  modifyLabel: string;
  canModify: (type: Type, parent?: Type) => boolean;
  onModify: (type: Type, settings: TypeSettings<any, any>) => Promise<TypeAndSettings<any, Subs> | null>;
}

export interface TypeNotModifiable
{
  modifiable?: false;
}

export interface TypeVisualRequired<T extends Type, Subs extends SubsType = unknown, OptionMap = any>
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
    [P in keyof OptionMap]: TypeVisualInput<T, OptionMap[P], Subs>;
  };
}

export type TypeVisualInput<T extends Type, Options, Subs extends SubsType = unknown> =
{
  name: string;
  description: string;
  settings: VueConstructor;
  input: VueConstructor;
  isVisible: (type: T) => boolean;
  getName: (options: Options) => string;
  getSummary: (options: Options) => string;
  getDefaultOptions: () => Options;
} & (
  Subs extends (string | number)
    ? {
        onSubAdd: (sub: Subs, type: T, settings: TypeSettings<Options, any>) => void;
        onSubRemove: (sub: Subs, type: T, settings: TypeSettings<Options, any>) => void;
        onSubMove: (from: Subs, to: Subs, type: T, settings: TypeSettings<Options, any>) => void;
      }
    : { }
);

export type TypeVisuals<
  T extends Type = Type,
  Build extends boolean = any, 
  Modify extends boolean = any,
  Subs extends SubsType = unknown
> = 
  TypeVisualRequired<T, Subs>
  & (Build extends true ? TypeBuildable<Subs> : TypeNotBuildable)
  & (Modify extends true ? TypeModifiable<Subs> : TypeNotModifiable)
;

export type TypeSettings<Options, Subs extends SubsType = unknown> =
  { input: string; options: Options; defaultValue: any; } 
  & (Subs extends string
      ? { sub: Record<Subs, TypeSettings<any, any>> }
      : { }
    );

export interface TypeAndSettings<Options = any, Subs extends SubsType = unknown>
{
  type: Type;
  settings: TypeSettings<Options, Subs>;
}
