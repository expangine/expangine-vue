
import Vue from 'vue';
import { BooleanType, Expression, Type, NoExpression, ObjectType, EnumType, OperationExpression, Color, ColorType, ColorSpaceHSL, ColorSpaceRGB } from 'expangine-runtime';
import { Registry } from '../Registry';
import { getConfirmation } from '@/app/Confirm';
import { ExpressionVisuals, ExpressionTypes } from './ExpressionVisuals';
import { TypeVisuals, TypeSettings } from '../types/TypeVisuals';


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
      inOperation: boolean;
      inOperationClass: string;
      visuals: ExpressionVisuals<E>;
      multiline: boolean;
    },
    {
      value: E;
      type: ExpressionTypes;
      context: Type;
      contextDetails: Record<string, string>;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings | null;
      pathSettings: TypeSettings | null;
      requiredType: Type | null;
      highlight: Map<Expression, string> | null;
      showComplexity: boolean;
      mutates: boolean;
      canRemove: boolean;
    }
  >({
    props: {
      value: {
        type: Object as () => E,
        required: true,
      },
      type: {
        type: String as () => ExpressionTypes,
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
        return Type.simplify(this.computedTypeRaw);
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

        if (!this.computedTypeRaw) {
          return true;
        }

        return !this.requiredType.acceptsType(this.computedTypeRaw);
      },
      highlighted(): boolean {
        return !!(this.highlight && this.highlight.has(this.value));
      },
      highlightColor(): string {
        return this.highlight
          ? this.highlight.get(this.value) || '#BBDEFB'
          : '#BBDEFB';
      },
      highlightStyle(): any {
        return this.highlighted
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
      inOperation(): boolean {
        return this.value 
          ? this.value.parent instanceof OperationExpression
            && !this.registry.getExpressionMultiline(this.value.parent)
          : false;
      },
      inOperationClass(): string {
        return this.inOperation ? 'pl-0' : 'pl-3';
      },
      visuals(): ExpressionVisuals<E> {
        return this.registry.getExpressionVisuals(this.value);
      },
      multiline(): boolean {
        return this.registry.getExpressionMultiline(this.value);
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
          if (await getConfirmation()) {
            this.remove();
          }
        }
      },
      hasContextVar(name: string) {
        return this.context instanceof ObjectType
          ? !!this.context.options.props[name]
          : false;
      },
    },
  });
}
