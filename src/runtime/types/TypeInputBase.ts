
import Vue, { PropType } from 'vue';
import { Type } from 'expangine-runtime';
import { TypeVisuals, TypeVisualInput, TypeSettings, SubsType } from './TypeVisuals';
import { Registry } from '../Registry';


export default function<T extends Type, O, V, S extends SubsType = unknown>(type: PropType<V>)
{
  return Vue.extend<
    unknown,
    {
      input(value: V): void;
      update(): void;
      clear(): void;
    },
    {
      computedValue: V;
      invalid: boolean;
      visuals: TypeVisuals<T, S>;
      inputSelected: TypeVisualInput<T, O, S>
    },
    {
      value: V;
      type: T;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings<O, S>;
    }
  >({
    props: {
      value: {
        type,
      },
      type: {
        type: Object as () => T,
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
        type: Object as () => TypeSettings<O, S>,
        required: true,
      },
    },
    computed: {
      computedValue: {
        get(): V {
          return this.value;
        },
        set(newValue: V) {
          this.input(newValue);
        },
      },
      invalid(): boolean {
        return !this.type.isValid(this.value);
      },
      visuals(): TypeVisuals<T, S> {
        return this.registry.getTypeVisuals(this.type);
      },
      inputSelected(): TypeVisualInput<T, O, S> {
        return this.visuals.inputs[this.settings.input];
      },
    },
    methods: {
      input(value) {
        this.$emit('input', value);
      },
      update() {
        this.input(this.value);
      },
      clear() {
        this.input(this.type.fromJson(this.settings.defaultValue));
      },
    },
  });
}
