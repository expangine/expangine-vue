
import { Type, Definitions, Expression, TypeSub, Operation } from 'expangine-runtime';
import { TypeVisuals, TypeSubOption, TypeSettings } from './types/TypeVisuals';
import { obj } from '@/common';
import { TypeBuilder, TypeBuildInput, TypeBuilderWrapper, TypeBuildOption, TypeBuilderWrapOption } from './types/TypeBuilder';
import { TypeModifier, TypeModifyInput, TypeModifyOption } from './types/TypeModifier';
import { TypeHook, TypeHookInput, TypeHookOption } from './types/TypeHook';
import { ExpressionVisuals, ExpressionTypes } from './exprs/ExpressionVisuals';
import { OperationVisuals } from './ops/OperationVisuals';


export class Registry
{
  
  public defs: Definitions;
  public typeMap: Record<string, TypeVisuals>;
  public types: TypeVisuals[];
  public typeBuilders: TypeBuilder[];
  public typeBuilderWrappers: TypeBuilderWrapper[];
  public typeModifiers: TypeModifier[];
  public typeHooks: TypeHook[];
  public exprMap: Record<string, ExpressionVisuals>;
  public exprs: ExpressionVisuals[];
  public operationMap: Record<string, OperationVisuals>;

  public constructor(defs: Definitions)
  {
    this.defs = defs;
    this.typeMap = obj();
    this.types = [];
    this.typeBuilders = [];
    this.typeBuilderWrappers = [];
    this.typeModifiers = [];
    this.typeHooks = [];
    this.exprMap = obj();
    this.exprs = [];
    this.operationMap = obj();
  }

  public import(importer: (registry: Registry) => any): this
  {
    importer(this);

    return this;
  }

  public addOperation<P extends string, O extends string, S extends string>(op: Operation<P, O, S, any, any>, visuals: OperationVisuals<P, O, S>): this
  {
    this.operationMap[op.id] = visuals;

    return this;
  }

  public getOperationVisuals(id: string): OperationVisuals
  {
    return this.operationMap[id] || {
      name: id,
      description: id,
      comments: obj(),
    };
  }

  public addExpression(expr: ExpressionVisuals): this
  {
    this.exprMap[expr.expr.id] = expr;
    this.exprs.push(expr);

    return this;
  }

  public getExpressionVisuals<E extends Expression>(expr: E): ExpressionVisuals<E>
  {
    return this.exprMap[expr.getId()];
  }

  public getExpressionsValid(type: ExpressionTypes, requiredType: Type | null, expr: Expression, exprType: Type | null): ExpressionVisuals[]
  {
    return this.exprs.filter((visual) => visual.types[type].isValid(requiredType, expr, exprType));
  }

  public getExpressionsStart(type: ExpressionTypes, requiredType: Type | null): ExpressionVisuals[]
  {
    return this.exprs.filter((visual) => visual.types[type].isStart(requiredType));
  }

  public getExpressionsModifiers(type: ExpressionTypes, requiredType: Type | null, expr: Expression, exprType: Type | null)
  {
    return this.exprs
      .map((visual) => visual.types[type].getModifiers(requiredType, expr, exprType))
      .reduce((prev, next) => next.concat(prev), [])
    ;
  }

  public getExpressionMultiline(expr: Expression): boolean
  {
    return this.getExpressionVisuals(expr).isMultiline(this, expr);
  }

  public addType(type: TypeVisuals<any, any, any>): this
  {
    this.typeMap[type.type.id] = type;
    this.types.push(type);

    return this;
  }

  public addTypeBuilder<T extends Type = Type>(builder: TypeBuilder<T>): this
  {
    this.typeBuilders.push(builder);

    return this;
  }

  public addTypeBuilderWrapper(wrapper: TypeBuilderWrapper): this
  {
    this.typeBuilderWrappers.push(wrapper);

    return this;
  }

  public addTypeModifier<T extends Type = Type>(modifier: TypeModifier<T>): this
  {
    this.typeModifiers.push(modifier);

    return this;
  }

  public addTypeHook(hook: TypeHook): this
  {
    this.typeHooks.push(hook);

    return this;
  }

  public getTypeVisuals<T extends Type>(type: T): TypeVisuals<T, any, any>
  {
    return this.typeMap[type.getId()] as unknown as TypeVisuals<T, any, any>;
  }

  public getTypeBuildersFor(input: TypeBuildInput): TypeBuildOption[]
  {
    const out: TypeBuildOption[] = [];

    for (const builder of this.typeBuilders) {
      const option = builder.getOption(input);

      if (option) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

  public getTypeBuilderWrappersFor(input: TypeBuildInput): TypeBuilderWrapOption[]
  {
    const out: TypeBuilderWrapOption[] = [];

    for (const wrapper of this.typeBuilderWrappers) {
      const option = wrapper.getOption(input);

      if (option) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

  public getTypeModifiersFor(input: TypeModifyInput): TypeModifyOption[]
  {
    const out: TypeModifyOption[] = [];

    for (const modifier of this.typeModifiers) {
      const option = modifier.getOption(input);

      if (option) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

  public getTypeHooksFor(input: TypeHookInput): TypeHookOption[]
  {
    const out: TypeHookOption[] = [];

    for (const hook of this.typeHooks) {
      const option = hook.getOption(input);

      if (option) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

  public getTypeCreate(type: Type): Expression
  {
    return this.getTypeVisuals(type).exprs.create(this, type);
  }

  public getTypeValid(type: Type): Expression
  {
    return this.getTypeVisuals(type).exprs.valid(this, type);
  }

  public getTypeCompare(type: Type): Expression
  {
    return this.getTypeVisuals(type).exprs.compare(this, type);
  }

  public getTypeSubOptions(type: Type): TypeSubOption[]
  {
    return this.getTypeVisuals(type).subOptions(this, type);
  }

  public getTypeDescribe(type: Type): string
  {
    return this.getTypeVisuals(type).describe(this, type);
  }

  public getTypeDefaultSettings(type: Type): TypeSettings
  {
    const visuals = this.getTypeVisuals(type);
    const input = visuals.defaultInput as string;

    return {
      input,
      defaultValue: null,
      options: {
        outlined: true,
        ...visuals.inputs[input].getDefaultOptions(),
      },
    };
  }

  public getTypeSubSettings(type: Type, settings: TypeSettings<any, string> & TypeSettings<any, number>, sub: TypeSub, forKey: boolean): TypeSettings | null
  {
    return this.getTypeVisuals(type).subSettings(this, type, settings, sub, forKey) || 
      (forKey
        ? sub.key instanceof Type
          ? this.getTypeDefaultSettings(sub.key)
          : null
        : this.getTypeDefaultSettings(sub.value)
      )
    ;
  }

}
