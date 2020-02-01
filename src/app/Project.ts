import { Type, Expression, FunctionType, ObjectType, Relation, TypeStorage } from 'expangine-runtime';
import { Transcoder, TranscoderStore } from './Transcoder';
import { TypeSettingsAny, TypeSettings } from '@/runtime/types/TypeVisuals';


export interface Project
{
  metadata: any;
  type: Type;
  settings: TypeSettingsAny;
  program: Expression;
  data: any;
  functions: Record<string, FunctionType>;
  aliased: Record<string, ObjectType>;
  aliasedSettings: Record<string, TypeSettings<any>>;
  aliasedData: Record<string, any[]>;
  storage: Record<string, TypeStorage>;
  relations: Record<string, Relation>;
}

export type ProjectType = keyof Project;

export type ProjectTranscoders = 
{
  [K in ProjectType]: Transcoder<Project[K], any>;
};

export type ProjectTranscoderStores = 
{
  [K in ProjectType]: TranscoderStore<Project[K], any>;
};

export type ProjectTransformer = 
{
  [K in ProjectType]: (project: Project) => Project[K];
};
