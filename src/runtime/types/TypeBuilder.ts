
import { Type } from 'expangine-runtime';
import { TypeSettings, TypeUpdateEvent } from './TypeVisuals';
import { Registry } from '../Registry';


export interface TypeBuildInput
{
  registry: Registry;
  parent?: Type;
  parentSettings?: TypeSettings;
  existingType?: Type;
  existingSettings?: TypeSettings;
  noTransform?: boolean;
}

export type TypeBuildHandler = () => Promise<TypeUpdateEvent | false>;

export interface TypeBuildOption
{
  text: string;
  description?: string;
  value: TypeBuildHandler;
  priority: number;
}

export interface TypeBuilder
{
  getOption: (input: TypeBuildInput) => TypeBuildOption | false;
}

export type TypeBuilderWrapHandler = (results: TypeUpdateEvent[]) => Promise<TypeUpdateEvent | false>;

export interface TypeBuilderWrapOption
{
  text: string;
  description?: string;
  multiple?: boolean;
  allowDuplicates?: boolean;
  priority: number;
  value: TypeBuilderWrapHandler;
}

export interface TypeBuilderWrapper
{
  getOption: (input: TypeBuildInput) => TypeBuilderWrapOption | false;
}
