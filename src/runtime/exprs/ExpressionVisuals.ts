
import { VueConstructor } from 'vue';
import { Expression, Type, ExpressionClass } from 'expangine-runtime';
import { ListOptions } from '@/common';



export type ExpressionTypes = 'body' | 'condition' | 'value';


export interface ExpressionVisuals<E extends Expression = any> 
{
  expr: ExpressionClass<E>;
  name: string;
  description: string;
  viewer: VueConstructor;
  editor: VueConstructor;
  types: Record<ExpressionTypes, ExpressionTypeDefinition<E>>;
}

export interface ExpressionTypeDefinition<E extends Expression>
{
  isStart: ExpressionStarter;
  isValid: ExpressionValidator<E>;
  getModifiers: ExpressionModifier<E>;
}

export type ExpressionStarter = 
  (requiredType: Type | null) => boolean;

export type ExpressionValidator<E extends Expression> = 
  (requiredType: Type | null, expr: E, exprType: Type | null) => any;

export type ExpressionModifier<E extends Expression> = 
  (requiredType: Type | null, expr: Expression, exprType: Type) => ListOptions<ExpressionModifierCallback<E>>;

export type ExpressionModifierCallback<E extends Expression> = 
  () => Promise<E>;
