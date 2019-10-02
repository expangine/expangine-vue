
import Vue from 'vue';
import { BooleanType, Expression, Type, NoExpression } from 'expangine-runtime';
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
    },
    {
      computedValue: E;
      computedType: Type | null;
      computedTypeVisuals: TypeVisuals | null;
      conditionType: Type;
      invalid: boolean;
      hasValue: boolean;
      isRemovable: boolean;
      visuals: ExpressionVisuals<E>;
      multiline: boolean;
    },
    {
      value: E;
      type: ExpressionTypes;
      context: Type;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings;
      pathSettings: TypeSettings;
      requiredType: Type;
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
      },
      pathSettings: {
        type: Object as () => TypeSettings,
      },
      requiredType: {
        type: Object as () => Type,
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
        default: false,
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
      computedType(): Type | null {
        const type = this.value.getType(this.registry.defs, this.context);
        return type ? type.getSimplifiedType() : type;
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
        return !!(this.requiredType 
          && this.computedType
          && !this.requiredType.isCompatible(this.computedType));
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
    },
  });
}
