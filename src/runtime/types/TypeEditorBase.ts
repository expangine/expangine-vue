
import Vue, { VueConstructor } from 'vue';
import { Type, OptionalType, ManyType, TypeCompatibleOptions } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { TypeVisuals, TypeVisualInput, TypeSettings, TypeUpdateEvent, SubsType, TypeSettingsAny } from './TypeVisuals';
import { Registry } from '../Registry';


export default function <T extends Type, O, S extends SubsType = unknown>()
{
  return Vue.extend<
    unknown,
    {
      update(): void;
      change(event?: Partial<TypeUpdateEvent>): void;
      triggerChange(event: TypeUpdateEvent): void;
      isValidType(requiredType: Type | null, type: Type): boolean;
    },
    {
      isRequired: boolean;
      isOptional: boolean;
      isAlternative: boolean;
      isOnly: boolean;
      visuals: TypeVisuals<T, S>;
      inputs: ListOptions;
      inputSelected: TypeVisualInput<T, O, S>;
      inputSettings: VueConstructor;
      inputInput: VueConstructor;
      invalid: boolean;
      highlighted: boolean;
      highlightColor: string;
      classes: string;
      color: string;
      summary: string;
      hasDefault: boolean;
      hideSubSettings: boolean;
    },
    {
      type: T;
      requiredType: Type | null;
      requiredTypeOptions: TypeCompatibleOptions | null;
      highlight: Map<Type, string> | null;
      parent: Type;
      readOnly: boolean;
      registry: Registry;
      settings: TypeSettings<O, S>;
      hideSettings: boolean;
      disableSubSettings: boolean;
    }
  >({
    props: {
      type: {
        type: Object as () => T,
        required: true,
      },
      requiredType: {
        type: Object as () => T,
        default: null,
      },
      requiredTypeOptions: {
        type: Object as () => TypeCompatibleOptions,
        default: null,
      },
      highlight: {
        type: Map as unknown as () => Map<Type, string>,
        default: null,
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
        type: Object as () => TypeSettings<O, S>,
        required: true,
      },
      hideSettings: {
        type: Boolean,
        default: false,
      },
      disableSubSettings: {
        type: Boolean,
        default: false,
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
      visuals(): TypeVisuals<T, S> {
        return this.registry.getTypeVisuals(this.type);
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
      inputSelected(): TypeVisualInput<T, O, S> {
        return this.visuals.inputs[this.settings.input] ||
               this.visuals.inputs[this.visuals.defaultInput as string];
      },
      inputSettings(): VueConstructor {
        return this.inputSelected.settings;
      },
      inputInput(): VueConstructor {
        return this.inputSelected.input;
      },
      hideSubSettings(): boolean {
        return !!this.inputSelected.hideSubSettings;
      },
      invalid(): boolean {
        return !this.isValidType(this.requiredType, this.type);
      },
      color(): string {
        return this.invalid 
          ? 'error' 
          : 'grey darken-2';
      },
      highlighted(): boolean {
        return !!(this.highlight && this.highlight.has(this.type));
      },
      highlightColor(): string {
        return this.highlight
          ? this.highlight.get(this.type) || ''
          : '';
      },
      classes(): string {
        return this.highlighted
          ? this.highlightColor
          : this.invalid 
            ? 'red lighten-5' 
            : '';
      },
      summary(): string {
        return this.inputSelected.getSummary(this.settings.options);
      },
      hasDefault(): boolean {
        return this.visuals.allowsDefault !== false;
      },
    },
    methods: {
      update() {
        this.triggerChange({
          type: this.type,
          settings: this.settings as TypeSettingsAny,
        });
      },
      change(event: Partial<TypeUpdateEvent> = {}): void {
        this.triggerChange({
          type: this.type,
          settings: this.settings as TypeSettingsAny,
          ...event,
        });
      },
      triggerChange(event: TypeUpdateEvent) {
        this.$emit('change', event);
      },
      isValidType(requiredType: Type | null, type: Type): boolean {
        return requiredType
          ? this.requiredTypeOptions
            ? requiredType.isCompatible(type, this.requiredTypeOptions)
            : requiredType.acceptsType(type)
          : true;
      },
    },
  });
}