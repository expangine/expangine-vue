
import { VueConstructor } from 'vue';
import { Type, TypeClass, Expression, TypeSub } from 'expangine-runtime';
import { Registry } from '../Registry';


export type SubsType = string | number | unknown;

export function createVisuals<
  T extends Type, 
  Subs extends SubsType,
  OptionMap
>(visuals: TypeVisuals<T, Subs, OptionMap>): TypeVisuals<T, Subs, OptionMap> 
{
  return visuals;
}

export interface TypeSubOption extends TypeSub
{
  text: string;
  description: string;
}

export interface TypeVisuals<
  T extends Type = Type, 
  Subs extends SubsType = unknown, 
  OptionMap = any
> {
  type: TypeClass<T>;
  name: string;
  description: string;
  describe: (registry: Registry, type: T) => string;
  describeLong: (registry: Registry, type: T, padding: string, tab: string, newline: string) => string;
  subOptions: (registry: Registry, type: T) => TypeSubOption[];
  subSettings: (registry: Registry, type: T, settings: TypeSettings<any, string> & TypeSettings<any, number>, sub: TypeSub, forKey: boolean) => TypeSettings | null;
  settingsFor: (options: { registry: Registry, type: T, sub: string | number, overrides: Record<string, any> }) => TypeSettings<any, any>;
  exprs: {
    create: (registry: Registry, type: T) => Expression;
    valid: (registry: Registry, type: T) => Expression;
    compare: (registry: Registry, type: T) => Expression;
  };
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
  getName: (options: Options) => string | undefined;
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
