
import { VueConstructor } from 'vue';
import { Expression, Type, ExpressionClass } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { Registry } from '../Registry';
import { ConfirmOptions } from '@/app/Confirm';



export interface ExpressionVisuals<E extends Expression = any> 
{
  expr: ExpressionClass<E>;
  create: (forType: Type | null, context: Type | null) => E;
  name: string;
  description: string;
  viewer: VueConstructor;
  editor: VueConstructor;
  complex: boolean;
  isMultiline: (registry: Registry, expr: E) => boolean;
  isStart: ExpressionStarter;
  getModifiers: ExpressionModifier;
}

export type ExpressionStarter = 
  (requiredType: Type | null) => boolean;

export type ExpressionModifier = 
  (requiredType: Type | null, expr: Expression, exprType: Type | null, registry: Registry) => ListOptions<ExpressionModifierCallback>;

export type ExpressionModifierCallback = 
  (() => Expression | null) | 
  ({
    options: Partial<ConfirmOptions>;
    handler: () => Expression | null;
  });
