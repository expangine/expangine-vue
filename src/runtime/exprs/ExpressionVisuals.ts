
import { VueConstructor } from 'vue';
import { Expression, Type, ExpressionClass } from 'expangine-runtime';
import { ListOptionsPriority } from '@/common';
import { Registry } from '../Registry';
import { ConfirmOptions } from '@/app/Confirm';



export interface ExpressionVisuals<E extends Expression = any> 
{
  expr: ExpressionClass<E>;
  menu: string;
  create: (forType: Type | null, context: Type | null, registry: Registry) => Expression;
  name: string;
  description: string;
  describe: (options: { registry: Registry, expr: E }) => string;
  viewer: VueConstructor;
  editor: VueConstructor;
  complex: boolean;
  isMultiline: (registry: Registry, expr: E) => boolean;
  getReturnExpressions: (registry: Registry, expr: E) => Expression[];
  isStart: ExpressionStarter;
  getModifiers: ExpressionModifier;
}

export type ExpressionStarter = 
  (requiredType: Type | null) => boolean;

export type ExpressionModifier = 
  (requiredType: Type | null, expr: Expression, exprType: Type | null, registry: Registry) => ListOptionsPriority<ExpressionModifierCallback>;

export type ExpressionModifierCallback = 
  (() => Expression | null) | 
  ({
    options: Partial<ConfirmOptions>;
    handler: () => Expression | null;
  });
