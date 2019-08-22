
import Vue, { PropType } from 'vue';
import { Type } from 'expangine-runtime';
import { TypeVisuals, TypeVisualInput, TypeSettings } from '../TypeVisuals';
import { Registry } from '../Registry';


export default function<T extends Type, O, V>(type: PropType<V>)
{
  return Vue.extend<
    unknown,
    {
      input(value: V): void;
      update(): void;
      clear(): void;
    },
    {
      invalid: boolean;
      visuals: TypeVisuals<T>;
      inputSelected: TypeVisualInput<T, O>
    },
    {
      value: V;
      type: T;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings<O>;
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
        type: Object as () => TypeSettings<O>,
        required: true,
      },
    },
    computed: {
      invalid(): boolean {
        return !this.type.isValid(this.value);
      },
      visuals(): TypeVisuals<T> {
        return this.registry.getVisuals(this.type);
      },
      inputSelected(): TypeVisualInput<T, O> {
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
        this.input(this.settings.defaultValue);
      },
    },
  });
}
