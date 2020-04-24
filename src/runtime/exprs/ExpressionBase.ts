
import Vue from 'vue';
import { BooleanType, Expression, Type, NoExpression, ObjectType, ColorType, ColorSpaceHSL, ColorSpaceRGB, objectMap, Types } from 'expangine-runtime';
import { ComplexityColors } from '@/common';
import { Preferences, PreferenceCategory } from '@/app/Preference';
import { sendNotification } from '@/app/Notify';
import { getConfirmation } from '@/app/Confirm';
import { Registry } from '../Registry';
import { ExpressionVisuals } from './ExpressionVisuals';
import { TypeVisuals, TypeSettings } from '../types/TypeVisuals';


const PREF_REMOVE_EXPRESSION = Preferences.define({
  key: 'remove_expression',
  label: 'Remove expressions without confirmation',
  category: [PreferenceCategory.EXPRESSION, PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export type ExpressionEventListeners = Record<string, (event: Event, expression: Expression) => void>;

export type ExpressionNativeListeners = Record<string, EventListener>;

export interface ExpressionDisplayOptions
{
  compact: boolean;
  color: string;
  error: string;
}

export default function<E extends Expression>()
{
  return Vue.extend<
    unknown,
    {
      input(value: Expression): void;
      update(): void;
      requestRemove(): void;
      remove(): void;
      hasContextVar(name: string): boolean;
      cutExpression(): void;
      copyExpression(): boolean;
      pasteExpression(): Promise<void>;
    },
    {
      computedValue: E;
      computedType: Type | null;
      computedTypeRaw: Type | null;
      computedTypeVisuals: TypeVisuals | null;
      conditionType: Type;
      invalid: boolean;
      highlighted: boolean;
      highlightColor: string;
      highlightStyle: any;
      highlightShadowColor: string;
      hasValue: boolean;
      isRemovable: boolean;
      visuals: ExpressionVisuals<E>;
      multiline: boolean;
      complexity: number;
      complexityColor: string;
      eventListenersNative: ExpressionNativeListeners;
    },
    {
      value: E;
      context: Type;
      contextDetails: Record<string, string>;
      data: any;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings | null;
      pathSettings: TypeSettings | null;
      requiredType: Type | null;
      highlight: Map<Expression, string> | null;
      showComplexity: boolean;
      mutates: boolean;
      canRemove: boolean;
      eventListeners: ExpressionEventListeners;
      displayOptions: ExpressionDisplayOptions;
    }
  >({
    props: {
      value: {
        type: Object as () => E,
        required: true,
      },
      context: {
        type: Object as () => Type,
        required: true,
      },
      contextDetails: {
        type: Object as () => Record<string, string>,
        default: () => ({}),
      },
      data: {
        default: null,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      registry: {
        type: Object as () => Registry,
        required: true,
      },
      settings: {
        type: Object as () => TypeSettings,
        default: null,
      },
      pathSettings: {
        type: Object as () => TypeSettings,
        default: null,
      },
      requiredType: {
        type: Object as () => Type,
        default: null,
      },
      highlight: {
        type: Map as unknown as () => Map<Expression, string>,
        default: null,
      },
      showComplexity: {
        type: Boolean,
        default: false,
      },
      mutates: {
        type: Boolean,
        default: false,
      },
      canRemove: {
        type: Boolean,
        default: true,
      },
      eventListeners: {
        type: Object as () => ExpressionEventListeners,
        default: () => ({}),
      },
      displayOptions: {
        type: Object as () => ExpressionDisplayOptions,
        default: () => ({
          compact: false,
          color: 'primary',
          error: 'error',
        }),
        validator: (options) => {
          options.compact = !!options.compact;
          options.color = options.color || 'primary';
          options.error = options.error || 'error';

          return true;
        },
      },
    },
    computed: {
      computedValue: {
        get(): E {
          return this.value;
        },
        set(newValue: E) {
          this.input(newValue);
        },
      },
      computedTypeRaw(): Type | null {
        return this.value.getType(this.registry.defs, this.context);
      },
      computedType(): Type | null {
        return Types.simplify(this.computedTypeRaw);
      },
      computedTypeVisuals(): TypeVisuals | null {
        return this.computedType
          ? this.registry.getTypeVisuals(this.computedType)
          : null;
      },
      conditionType(): Type {
        return BooleanType.baseType;
      },
      invalid(): boolean {
        if (!this.requiredType) {
          return false;
        }

        if (this.value === NoExpression.instance && this.requiredType.isOptional()) {
          return false;
        }

        if (!this.computedTypeRaw || !this.computedType) {
          return true;
        }

        return !this.requiredType.acceptsType(this.computedTypeRaw) && 
               !this.requiredType.acceptsType(this.computedType);
      },
      highlighted(): boolean {
        return !!(this.highlight && this.highlight.has(this.value));
      },
      highlightColor(): string {
        const DEFAULT_COLOR = '#BBDEFB';

        return this.showComplexity
          ? this.complexityColor
          : this.highlight
            ? this.highlight.get(this.value) || DEFAULT_COLOR
            : DEFAULT_COLOR;
      },
      highlightStyle(): any {
        return this.highlighted || this.showComplexity
          ? { 'box-shadow': '0 0 3px ' + this.highlightShadowColor,
              'background-color': this.highlightColor }
          : { };
      },
      highlightShadowColor(): string {
        const color = ColorType.baseType.normalize(this.highlightColor);
        if (!color) { 
          return this.highlightColor;
        }
        const hsl = ColorSpaceHSL.fromColor(color);
        hsl.l -= 30;
        const rgb = ColorSpaceHSL.toColor(hsl);
        const formatted = ColorSpaceRGB.formatMap.hex.formatter(rgb);

        return formatted;
      },
      hasValue(): boolean {
        return this.value && this.value !== NoExpression.instance;
      },
      isRemovable(): boolean {
        return !this.readOnly && this.canRemove;
      },
      visuals(): ExpressionVisuals<E> {
        return this.registry.getExpressionVisuals(this.value);
      },
      multiline(): boolean {
        return this.registry.getExpressionMultiline(this.value);
      },
      complexity(): number {
        return this.value.getComplexity(this.registry.defs, this.context);
      },
      complexityColor(): string {
        const c = Math.round(this.complexity);
        const i = Math.min(c, ComplexityColors.length - 1);

        return ComplexityColors[i];
      },
      eventListenersNative(): ExpressionNativeListeners {
        return objectMap(this.eventListeners, (handler) => (event) => handler(event, this.value));
      },
    },
    methods: {
      input(value) {
        this.$emit('input', value);
      },
      update() {
        this.input(this.value);
      },
      remove() {
        this.$emit('remove', this.value);
      },
      async requestRemove() {
        if (this.isRemovable) {
          const describe = this.registry.getExpressionDescribe(this.value);

          if (await getConfirmation({ message: `Remove "${describe}"?`, pref: PREF_REMOVE_EXPRESSION })) {
            this.remove();
          }
        }
      },
      hasContextVar(name: string) {
        return this.context instanceof ObjectType
          ? !!this.context.options.props[name]
          : false;
      },
      cutExpression(): void {
        if (this.isRemovable && this.copyExpression()) {
          this.requestRemove();
        }
      },
      copyExpression(): boolean {
        if (this.value !== NoExpression.instance) {
          this.registry.copy(this.value);
  
          sendNotification({ message: 'Expression Copied' });
  
          return true;
        }

        return false;
      },
      async pasteExpression() {
        const expr = this.registry.expressionClipboard[0];
  
        if (!expr) {
          return;
        }
  
        const { context, requiredType, registry } = this;
        const defaultMessage = 'Are you sure?';
        let message = defaultMessage;
  
        if (context && requiredType) {
          const exprType = expr.getType(registry.defs, context);
          
          if (exprType && !requiredType.acceptsType(exprType)) {
            message = 'Are you sure? The expression does NOT return the required type.';
          }
        }
  
        const prompt = message !== defaultMessage || this.value !== NoExpression.instance;
  
        if (!prompt || await getConfirmation({ message, pref: 'paste_expression' })) {
          this.input(expr.clone());
        }
      },
    },
  });
}
