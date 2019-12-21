
import { VueConstructor } from 'vue';
import { Type, TypeClass, Expression, TypeSub, Computed } from 'expangine-runtime';
import { Registry } from '../Registry';


export type SubsType = string | number | unknown;

export function createVisuals<Subs extends SubsType>()
{
  return <T extends Type, OptionMap>(visuals: TypeVisuals<T, Subs, OptionMap>): TypeVisuals<T, Subs, OptionMap> => visuals;
}

export interface TypeSubOption extends TypeSub
{
  text: string;
  description: string;
}

export interface TypeSubNode
{
  sub: any;
  subType: Type;
  value: any;
  valueType: Type;
}

export interface TypeComputedOption
{
  text: string;
  description: string;
  details?: string;
  value: Computed;
}

export interface TypeVisuals<
  T extends Type = Type, 
  Subs extends SubsType = unknown, 
  OptionMap = any
> {
  type: TypeClass<T>;
  name: string;
  description: string;
  describe: (options: { registry: Registry, type: T }) => string;
  describeLong: (registry: Registry, type: T, padding: string, tab: string, newline: string) => string;
  stringify: (options: {
    value: any,
    registry: Registry, 
    type: T,
  }) => string;
  toString: (options: { 
    value: any, 
    registry: Registry, 
    type: T, 
    padding: string, 
    tab: string, 
    newline: string, 
    process: (data: any, type: Type) => any,
    processInvalid: (data: any, type: Type) => any,
  }) => string;
  subNodes: (options: { 
    registry: Registry, 
    type: T, 
    value: any, 
  }) => TypeSubNode[];
  subOptions: (registry: Registry, type: T) => TypeSubOption[];
  subSettings: (registry: Registry, type: T, settings: TypeSettings<any, Subs>, sub: TypeSub, forKey: boolean) => TypeSettings | null;
  settingsFor: (options: { registry: Registry, type: T, sub: Subs, overrides: Record<string, any> }) => TypeSettings<any, Subs>;
  editor: VueConstructor;
  options?: VueConstructor;
  allowsDefault?: boolean;
  defaultInput: keyof OptionMap;
  inputsOrder: Array<keyof OptionMap>;
  inputs: {
    [P in keyof OptionMap]: TypeVisualInput<T, OptionMap[P], Subs>;
  };
}

export interface TypeVisualInputBase<T extends Type, Options, Subs extends SubsType = unknown>
{
  name: string;
  description: string;
  hideSubSettings?: boolean;
  settings: VueConstructor;
  input: VueConstructor;
  getComplexity: (options: {type: T, settings: TypeSettings<Options, Subs>, registry: Registry}) => number; // 0 = single line, 1 = multiline, fixed number of lines, 2 = multiple lines depending on input
  isVisible: (type: T) => boolean;
  getName: (options: Options) => string | undefined;
  getSummary: (options: Options) => string;
  getDefaultOptions: () => Options;
}

export interface TypeVisualInputSubs<T extends Type, Options, Subs extends SubsType = unknown> extends TypeVisualInputBase<T, Options, Subs>
{
  onSubAdd: (sub: Subs, type: T, settings: TypeSettings<Options, Subs>) => void;
  onSubRemove: (sub: Subs, type: T, settings: TypeSettings<Options, Subs>) => void;
  onSubMove: (from: Subs, to: Subs, type: T, settings: TypeSettings<Options, Subs>) => void;
}

export type TypeVisualInput<T extends Type, Options, Subs extends SubsType = unknown> =
  Subs extends (string | number)
  ? TypeVisualInputSubs<T, Options, Subs>
  : TypeVisualInputBase<T, Options, Subs>;

export interface TypeSettingsBase<Options>
{
  input: string; 
  options: Options; 
  defaultValue: any;
}

export interface TypeSettingsRecord<Options, Subs extends string> extends TypeSettingsBase<Options>
{
  sub: Record<Subs, TypeSettings<any, any>>;
}

export interface TypeSettingsArray<Options> extends TypeSettingsBase<Options>
{
  sub: Array<TypeSettings<any, any>>;
}

export interface TypeSettingsAny<Options = any> extends TypeSettingsBase<Options>
{
  sub?: Record<any, TypeSettings<any, any>> | Array<TypeSettings<any, any>>;
}

export type TypeSettings<Options = any, Subs extends SubsType = unknown> =
  string[] extends Subs // since we only care about string | number, using another type fishes out any
  ? TypeSettingsAny<Options>
  : [Subs] extends [string]
    ? TypeSettingsRecord<Options, Subs>
    : [Subs] extends [number]
      ? TypeSettingsArray<Options>
      : TypeSettingsBase<Options>;

export interface TypeUpdateEvent
{
  type: Type;
  settings: TypeSettingsAny;
  transform?: Expression;
}
