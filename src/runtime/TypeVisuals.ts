
import { VueConstructor } from 'vue';
import { Type, TypeClass } from 'expangine-runtime';
import { Registry } from './Registry';


export type SubsType = string | number | unknown;

export function createVisuals<
  T extends Type, 
  Subs extends SubsType,
  OptionMap
>(visuals: TypeVisuals<T, Subs, OptionMap>): TypeVisuals<T, Subs, OptionMap> 
{
  return visuals;
}

export interface TypeVisuals<
  T extends Type = Type, 
  Subs extends SubsType = unknown, 
  OptionMap = any
> {
  type: TypeClass<T>;
  name: string;
  description: string;
  editor: VueConstructor;
  options?: VueConstructor;
  allowsDefault?: boolean;
  defaultInput: keyof OptionMap;
  inputsOrder: Array<keyof OptionMap>;
  inputs: {
    [P in keyof OptionMap]: TypeVisualInput<T, OptionMap[P], Subs>;
  };
}

export type TypeVisualInput<T extends Type, Options, Subs extends SubsType = unknown> =
{
  name: string;
  description: string;
  hideSubSettings?: boolean;
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

export type TypeSettings<Options = any, Subs extends SubsType = unknown> =
  { input: string; options: Options; defaultValue: any; } 
  & (Subs extends string
      ? { sub: Record<Subs, TypeSettings<any, any>> }
      : Subs extends number
        ? { sub: Array<TypeSettings<any, any>> }
        : { }
    );

export interface TypeAndSettings<Options = any, Subs extends SubsType = unknown>
{
  type: Type;
  settings: TypeSettings<Options, Subs>;
}
