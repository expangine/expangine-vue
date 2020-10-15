
import Vue from 'vue';
import { Registry } from '../../runtime/Registry';
import { NodeTemplateChild } from 'expangine-ui';
import { Type, Validation, ValidationSeverity } from 'expangine-runtime';
import { NodeVisuals } from './NodeVisuals';


export default function<C extends NodeTemplateChild>()
{
  return Vue.extend<
    unknown,
    {
      update(): void;
      input(value: C): void;
    },
    {
      visuals: NodeVisuals | undefined;
      validations: Validation[];
      validationsSevere: Validation[];
    },
    {
      value: C;
      context: Type;
      registry: Registry;
      readOnly: boolean;
      validationSeverity: ValidationSeverity;
    }
  >({
    props: {
      value: {
        type: [Object, Array, String] as any as () => C,
        required: true,
      },
      context: {
        type: Object as () => Type,
        required: true,
      },
      registry: {
        type: Object as () => Registry,
        required: true,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
      validationSeverity: {
        type: Number as () => ValidationSeverity,
        default: ValidationSeverity.MEDIUM,
      },
    },
    computed: {
      visuals(): NodeVisuals | undefined {
        return this.registry.getNodeVisuals(this.value);
      },
      validations(): Validation[] {
        return [];
      },
      validationsSevere(): Validation[] {
        return this.validations.filter((v) => v.severity >= this.validationSeverity);
      },
    },
    methods: {
      update(): void {
        this.input(this.value);
      },
      input(value: NodeTemplateChild): void {
        this.$emit('input', value);
      },
    },
  });
}
