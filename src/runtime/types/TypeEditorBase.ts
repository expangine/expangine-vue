
import Vue, { VueConstructor } from 'vue';
import { Type, OptionalType, ManyType } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { TypeVisuals, TypeVisualInput, TypeSettings } from '../TypeVisuals';
import { Registry } from '../Registry';


export default function <T extends Type, O>()
{
  return Vue.extend<
    unknown,
    {
      updateSettings(): void;
      updateType(): void;
    },
    {
      isRequired: boolean;
      isOptional: boolean;
      isAlternative: boolean;
      isOnly: boolean;
      visuals: TypeVisuals<T>;
      inputs: ListOptions;
      inputSelected: TypeVisualInput<T, O>;
      inputSettings: VueConstructor;
      summary: string;
      hasDefault: boolean;
    },
    {
      type: T;
      parent: Type;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings<O>;
    }
  >({
    props: {
      type: {
        type: Object as () => T,
        required: true,
      },
      parent: {
        type: Object as () => Type,
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
      isRequired(): boolean {
        return !this.isOptional;
      },
      isOptional(): boolean {
        return this.parent && this.parent instanceof OptionalType;
      },
      isAlternative(): boolean {
        return this.parent && this.parent instanceof ManyType;
      },
      isOnly(): boolean {
        return !this.isAlternative;
      },
      visuals(): TypeVisuals<T> {
        return this.registry.getVisuals(this.type);
      },
      inputs(): ListOptions {
        const { inputsOrder, inputs } = this.visuals;
        const items: ListOptions = [];

        for (const inputName of inputsOrder)
        {
          const inputKey = inputName as string;
          const input = inputs[inputKey];
          if (input.isVisible(this.type)) {
            items.push({
              text: input.name,
              value: inputKey,
            });
          }
        }

        return items;
      },
      inputSelected(): TypeVisualInput<T, O> {
        return this.visuals.inputs[this.settings.input];
      },
      inputSettings(): VueConstructor {
        return this.inputSelected.settings;
      },
      summary(): string {
        return this.inputSelected.getSummary(this.settings.options);
      },
      hasDefault(): boolean {
        return this.visuals.allowsDefault !== false;
      },
    },
    methods: {
      updateType() {
        this.$emit('input:type', this.type);
      },
      updateSettings() {
        this.$emit('input:settings', this.settings);
      },
    },
  });
}
