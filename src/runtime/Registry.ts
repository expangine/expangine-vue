
import { Type, Definitions, Expression, TypeSub, Operation, ObjectType, OperationPair } from 'expangine-runtime';
import { TypeVisuals, TypeSubOption, TypeSettings, TypeSubNode, TypeComputedOption, TypeDataImport, TypeDataImportMatch } from './types/TypeVisuals';
import { obj } from '@/common';
import { TypeBuilder, TypeBuildInput, TypeBuilderWrapper, TypeBuildOption, TypeBuilderWrapOption } from './types/TypeBuilder';
import { TypeModifier, TypeModifyInput, TypeModifyOption } from './types/TypeModifier';
import { TypeHook, TypeHookInput, TypeHookOption } from './types/TypeHook';
import { ExpressionVisuals } from './exprs/ExpressionVisuals';
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
  public settingsOverrides: Record<string, any> = {};
  public dataImportTypes: TypeDataImport[];

  public expressionClipboard: Expression[];
  public expressionClipboardMax: number;

  public isValidFunction: (name: string) => boolean;
  public isValidProperty: (name: string, type: ObjectType) => boolean;
  public isValidExpressionStart: (visuals: ExpressionVisuals, requiredType: Type | null) => boolean;
  public isValidExpressionModify: (visuals: ExpressionVisuals, requiredType: Type | null, expr: Expression, exprType: Type | null) => boolean;
  public isValidExpressionCopy: (expr: Expression) => boolean;
  public isValidTypeBuildOption: (option: TypeBuildOption, input: TypeBuildInput) => boolean;
  public isValidTypeBuildWrapperOption: (option: TypeBuilderWrapOption, input: TypeBuildInput) => boolean;
  public isValidTypeModifyOption: (option: TypeModifyOption, input: TypeModifyInput) => boolean;
  public isValidTypeHookOption: (option: TypeHookOption, input: TypeHookInput) => boolean;
  public isValidOperation: (pair: OperationPair, requiredType?: Type | null, startingType?: Type | null) => boolean;
  public isClipboardEnabled: () => boolean;

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
    this.dataImportTypes = [];
    this.expressionClipboard = [];
    this.expressionClipboardMax = 10;

    this.isValidFunction = () => true;
    this.isValidProperty = () => true;
    this.isValidExpressionStart = () => true;
    this.isValidExpressionModify = () => true;
    this.isValidTypeBuildOption = () => true;
    this.isValidTypeBuildWrapperOption = () => true;
    this.isValidTypeModifyOption = () => true;
    this.isValidTypeHookOption = () => true;
    this.isValidExpressionCopy = () => true;
    this.isClipboardEnabled = () => true;
    this.isValidOperation = () => true;
  }

  public import(importer: (registry: Registry) => any): this
  {
    importer(this);

    return this;
  }

  public copy(expr: Expression)
  {
    this.expressionClipboard.unshift(expr.clone());

    if (this.expressionClipboard.length > this.expressionClipboardMax) 
    {
      this.expressionClipboard.splice(this.expressionClipboardMax, this.expressionClipboard.length - this.expressionClipboardMax);
    }
  }

  public addDataImportType(dataImportType: TypeDataImport)
  {
    this.dataImportTypes.push(dataImportType);
    this.dataImportTypes.sort((a, b) => a.priority - b.priority);

    return this;
  }

  public getDataImportMatches(values: any[]): TypeDataImportMatch[]
  {
    const types = this.dataImportTypes;
    const counts = types.map(() => 0);
    const map: Map<any, boolean> = new Map();
    let empty = 0;
    let duplicates = 0;

    for (const value of values)
    {
      if (value === '' || value === null || value === undefined)
      {
        empty++;
      }
      else 
      {
        if (map.get(value))
        {
          duplicates++;
        }

        map.set(value, true);

        for (let i = 0; i < types.length; i++)
        {
          if (types[i].is(value))
          {
            counts[i]++;
          }
        }
      }
    }
    
    const nonEmpty = values.length - empty;
    const unique = Array.from(map.keys());
    const matches: TypeDataImportMatch[] = [];

    for (let i = 0; i < types.length; i++)
    {
      if (counts[i] === nonEmpty)
      {
        matches.push({
          type: types[i],
          optional: types[i].allowsEmpty ? false : empty > 0,
          duplicates: duplicates > 0,
          unique,
        });
      }
    }

    return matches;
  }

  public addOperation<P extends string, O extends string, S extends string>(op: Operation<P, O, S, any, any>, visuals: OperationVisuals<P, O, S>): this
  {
    this.operationMap[op.id] = visuals as unknown as OperationVisuals<any, any, any>;

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

  public getExpressions(): ExpressionVisuals[]
  {
    return this.exprs;
  }

  public getExpressionsStart(requiredType: Type | null): ExpressionVisuals[]
  {
    return this.exprs.filter((visual) => visual.isStart(requiredType) && this.isValidExpressionStart(visual, requiredType));
  }
  
  public getExpressionsModifiers(requiredType: Type | null, expr: Expression, exprType: Type | null)
  {
    return this.exprs
      .map((visual) => 
        this.isValidExpressionModify(visual, requiredType, expr, exprType)  
          ? visual.getModifiers(requiredType, expr, exprType, this)
          : [],
      )
      .reduce((prev, next) => next.concat(prev), [])
      .sort((a, b) => a.priority - b.priority)
    ;
  }

  public getExpressionReturns(expr?: Expression | null): Expression[]
  {
    return expr ? this.getExpressionVisuals(expr).getReturnExpressions(this, expr) : [];
  }

  public getExpressionMultiline(expr: Expression): boolean
  {
    return this.getExpressionVisuals(expr).isMultiline(this, expr);
  }

  public getExpressionComplex(expr: Expression): boolean
  {
    return this.getExpressionVisuals(expr).complex;
  }

  public getExpressionName(expr: Expression): string
  {
    return this.getExpressionVisuals(expr).name;
  }

  public getExpressionDescription(expr: Expression): string
  {
    return this.getExpressionVisuals(expr).description;
  }

  public getExpressionDescribe(expr: Expression): string
  {
    return this.getExpressionVisuals(expr).describe({ registry: this, expr });
  }

  public getExpressionMenu(expr: Expression): string
  {
    return this.getExpressionVisuals(expr).menu;
  }

  public addType(type: TypeVisuals<any, any, any>): this
  {
    this.typeMap[type.type.id] = type;
    this.types.push(type);

    return this;
  }

  public addTypeBuilder(builder: TypeBuilder): this
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

  public getTypeVisuals<T extends Type>(type: T, throwError: boolean = true): TypeVisuals<T, any, any>
  {
    const visuals = this.typeMap[type.getId()] as unknown as TypeVisuals<T, any, any>;

    if (!visuals && throwError)
    {
      throw new Error('There are no visuals for ' + type ? JSON.stringify(type.encode()) : 'an undefined type');
    }

    return visuals;
  }

  public getTypeVisualInputComplexity(type: Type, settings: TypeSettings): number
  {
    return this.getTypeVisuals(type).inputs[settings.input].getComplexity({ type, settings, registry: this });
  }

  public getTypeSettingsValidFor(type: Type | null, settings: TypeSettings | null): boolean
  {
    return !!(type
      && settings 
      && settings.input
      && this.getTypeVisuals(type).inputs[settings.input]);
  }

  public getTypeBuildersFor(input: TypeBuildInput): TypeBuildOption[]
  {
    const out: TypeBuildOption[] = [];

    for (const builder of this.typeBuilders) {
      const option = builder.getOption(input);

      if (option && this.isValidTypeBuildOption(option, input)) {
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

      if (option && this.isValidTypeBuildWrapperOption(option, input)) {
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

      if (option && this.isValidTypeModifyOption(option, input)) {
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

      if (option && this.isValidTypeHookOption(option, input)) {
        out.push(option);
      }
    }

    out.sort((a, b) => a.priority - b.priority);

    return out;
  }

  public getTypeCreate(type: Type): Expression
  {
    return type.getCreateExpression();
  }

  public getTypeValid(type: Type): Expression
  {
    return type.getValidateExpression();
  }

  public getTypeCompare(type: Type): Expression
  {
    return type.getCompareExpression();
  }

  public getTypeComputedOptions(type: Type): TypeComputedOption[]
  {
    return this.defs.getComputedsFor(type).map((value) => {
      const op = this.getOperationVisuals(value.op);

      return {
        value,
        text: value.id.split(':')[1],
        description: op.name,
        /*
        details: templateReplace(
          op.singleline,
          (token) => token === value.value 
            ? '<strong>this</strong>' 
            : token in value.params
              ? '<strong>' + value.params[token] + '</strong>'
              : token in op.defaults
                ? '<strong>' + op.defaults[token] + '</strong>'
                : token,
        ),
        */
      };
    });
  }

  public getTypeSubOptions(type: Type): TypeSubOption[]
  {
    const visuals = this.getTypeVisuals(type);

    return visuals ? visuals.subOptions(this, type) : [];
  }

  public getTypeDescribe(type: Type): string
  {
    return this.getTypeVisuals(type).describe({ registry: this, type });
  }

  public getTypeDescribeLong(type: Type, tab: string, newline: string, padding: string = ''): string
  {
    return this.getTypeVisuals(type).describeLong(this, type, padding, tab, newline);
  }

  public getTypeStringify(type: Type, value: any): string
  {
    return this.getTypeVisuals(type).stringify({ registry: this, type, value });
  }

  public getTypeName(type: Type): string
  {
    return this.getTypeVisuals(type).name(type);
  }

  public getTypeSubSettings(type: Type, settings: TypeSettings<any, string> & TypeSettings<any, number>, sub: TypeSub, forKey: boolean): TypeSettings | null
  {
    return this.getTypeVisuals(type).subSettings(this, type, settings, sub, forKey) || 
      (forKey
        ? sub.key instanceof Type
          ? this.getTypeSettings(sub.key)
          : null
        : this.getTypeSettings(sub.value)
      )
    ;
  }

  public getTypeSettings(type: Type, sub: string | number = ''): TypeSettings<any, any>
  {
    return this.getTypeVisuals(type).settingsFor({ registry: this, type, overrides: this.settingsOverrides, sub });
  }

  public getTypeToString(
    value: any, type: Type, tab: string, newline: string, 
    padding: string = '', 
    process: (data: any, type: Type) => any = ((x) => undefined), 
    processInvalid: (data: any, type: Type) => any = ((x) => 'invalid(' + JSON.stringify(x) + ')'),
  ): string
  {
    return this.getTypeVisuals(type).toString({ registry: this, value, type, tab, newline, padding, process, processInvalid });
  }

  public getTypeSubNodes(value: any, type?: Type): TypeSubNode[]
  {
    if (!type) 
    {
      type = this.defs.describe(value);
    }

    return this.getTypeVisuals(type).subNodes({ value, type, registry: this });
  }

}
