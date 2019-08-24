
import Vue from 'vue';
import { Type } from 'expangine-runtime';


export default function <T extends Type, O>()
{
  return Vue.extend<
    unknown,
    {
      input(): void;
    },
    unknown,
    {
      type: T;
      value: O;
      readOnly: boolean;
    }
  >({
    props: {
      type: {
        type: Object as () => T,
        required: true,
      },
      value: {
        type: Object as () => O,
        required: true,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      input() {
        this.$emit('input', this.value);
      },
    },
  });
}
