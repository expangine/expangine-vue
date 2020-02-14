
import Vue, { PropType } from 'vue';
import { Type } from 'expangine-runtime';
import { Data } from '../../app/Data';
import { TypeVisuals, TypeVisualInput, TypeSettings, SubsType } from './TypeVisuals';
import { Registry } from '../Registry';


export default function<T extends Type, O, V, S extends SubsType = unknown>(type?: PropType<V>)
{
  return Vue.extend<
    {
      valueInternal: V | null;
      valueLoading: boolean;
      valueLoadCount: number;
    },
    {
      reload(): void;
      input(value: V): void;
      update(): void;
      clear(): void;
    },
    {
      computedValue: V;
      invalid: boolean;
      visuals: TypeVisuals<T, S>;
      inputSelected: TypeVisualInput<T, O, S>;
      loading: boolean;
      reloading: boolean;
    },
    {
      value: V;
      type: T;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings<O, S>;
      data: Data | null;
      path: Array<string | number>;
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
      path: {
        type: Array,
        default: () => [],
      },
      data: {
        type: Object as () => Data | null,
        default: null,
      },
    },
    data: () => ({
      valueInternal: null,
      valueLoading: true,
      valueLoadCount: 0,
    }),
    computed: {
      computedValue: {
        get(): V {
          if (this.valueInternal !== null) {
            return this.valueInternal;
          }
          if (this.value === null && !this.type.isValid(this.value)) {
            this.input(this.type.create());
          }
          return this.value;
        },
        set(newValue: V) {
          this.input(newValue);

          if (this.data) {
            this.data.set(this.path, newValue);
          } else {
            this.valueInternal = newValue;
          }
        },
      },
      invalid(): boolean {
        return !this.type.isValid(this.computedValue);
      },
      visuals(): TypeVisuals<T, S> {
        return this.registry.getTypeVisuals(this.type);
      },
      inputSelected(): TypeVisualInput<T, O, S> {
        return this.visuals.inputs[this.settings.input];
      },
      loading(): boolean {
        return this.valueLoading && this.valueInternal === null;
      },
      reloading(): boolean {
        return this.valueLoading && this.valueInternal !== null;
      },
    },
    watch: {
      value: {
        immediate: true,
        handler(value: V) {
          this.valueInternal = value;
          if (!this.data && this.valueLoading) {
            this.valueLoading = false;
          }
        },
      },
      data: {
        immediate: true,
        handler(data: Data | null) {
          this.reload();
        },
      },
      path() {
        this.reload();
      },
    },
    methods: {
      input(value) {
        this.$emit('input', value);
      },
      update() {
        this.input(this.computedValue);
      },
      clear() {
        this.input(this.type.fromJson(this.settings.defaultValue));
      },
      async reload() {
        if (!this.data) {
          return;
        }

        try {
          const count = ++this.valueLoadCount;

          this.valueLoading = true;

          const newValue = await this.data.get(this.path) as V;

          if (this.valueLoadCount === count) {
            this.valueInternal = newValue;
            this.valueLoading = false;
          }
        } catch (e) {
          window.console.log('reload error', e);
        }
      },
    },
  });
}
