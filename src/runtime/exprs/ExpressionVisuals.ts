
import { VueConstructor } from 'vue';
import { Expression, Type, ExpressionClass } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { Registry } from '../Registry';



export type ExpressionTypes = 'body' | 'condition' | 'value';


export interface ExpressionVisuals<E extends Expression = any> 
{
  expr: ExpressionClass<E>;
  create: (forType: Type | null, context: Type | null) => E;
  name: string;
  description: string;
  viewer: VueConstructor;
  editor: VueConstructor;
  isMultiline: (registry: Registry, expr: E) => boolean;
  types: Record<ExpressionTypes, ExpressionTypeDefinition<E>>;
}

export interface ExpressionTypeDefinition<E extends Expression>
{
  isStart: ExpressionStarter;
  isValid: ExpressionValidator<E>;
  getModifiers: ExpressionModifier;
}

export type ExpressionStarter = 
  (requiredType: Type | null) => boolean;

export type ExpressionValidator<E extends Expression> = 
  (requiredType: Type | null, expr: E, exprType: Type | null) => any;

export type ExpressionModifier = 
  (requiredType: Type | null, expr: Expression, exprType: Type | null) => ListOptions<ExpressionModifierCallback>;

export type ExpressionModifierCallback = 
  () => Expression;
