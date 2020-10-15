
import Vue from 'vue';
import { Registry } from '@/runtime/Registry';
import { NodeTemplate } from 'expangine-ui';
import { CompilerVisuals } from './CompilerVisuals';
import { Type, Validation, ValidationSeverity } from 'expangine-runtime';
import { validateChildren, validateRecord } from './helpers';


export default function<C extends NodeTemplate = NodeTemplate>()
{
  return Vue.extend<
    unknown,
    {
      update(): void;
      input(value: C): void;
    },
    {
      visuals: CompilerVisuals | undefined;
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
        type: Array as any as () => C,
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
      visuals(): CompilerVisuals {
        return this.registry.getCompilerVisuals(this.value);
      },
      validations(): Validation[] {
        const validations: Validation[] = [];
        const [, attrs, events, children] = this.value;
        validateRecord(attrs, this.registry.defs, this.context, validations);
        validateRecord(events, this.registry.defs, this.context, validations);
        validateChildren(children, this.registry.defs, this.context, validations);
        return validations;
      },
      validationsSevere(): Validation[] {
        return this.validations.filter((v) => v.severity >= this.validationSeverity);
      },
    },
    methods: {
      update(): void {
        this.input(this.value);
      },
      input(value: NodeTemplate): void {
        this.$emit('input', value);
      },
    },
  });
}

