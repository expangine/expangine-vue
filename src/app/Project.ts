import { Type, Expression, FunctionType } from 'expangine-runtime';
import { Transcoder, TranscoderStore } from './Transcoder';
import { TypeSettingsAny } from '@/runtime/types/TypeVisuals';


export interface Project
{
  metadata: any;
  type: Type;
  settings: TypeSettingsAny;
  program: Expression;
  data: any;
  functions: Record<string, FunctionType>;
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
