<template>
  <tr @click="edit">
    <td>
      <v-icon :color="statusColor">
        {{ statusIcon }}
      </v-icon>
    </td>
    <td>
      {{ test.name }}
    </td>
    <td class="ex-single-line">
      {{ test.description }}
    </td>
    <td>
      <v-icon @click="edit">mdi-pencil</v-icon>
      <v-icon @click="remove">mdi-delete</v-icon>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import { Func, FuncTest, compare, copy } from 'expangine-runtime';
import { LiveRuntime, LiveContext } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';
import { Preferences, PreferenceCategory } from './Preference';
import { getFuncTest } from './FuncTest';
import { Registry } from '../runtime/Registry';


const PREF_REMOVE_PROGRAM = Preferences.define({
  key: 'func_test_remove',
  label: 'Remove function unit test without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    func: {
      type: Object as () => Func,
      required: true,
    },
    test: {
      type: Object as () => FuncTest,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  computed: {
    actual(): any {
      return LiveRuntime.run(this.func.expression, copy(this.test.args));
    },
    passed(): boolean {
      return compare(this.actual, this.test.expected) === 0;
    },
    statusIcon(): string {
      return this.passed ? 'mdi-check-circle' : 'mdi-close-circle';
    },
    statusColor(): string {
      return this.passed ? 'green' : 'error';
    },
  },
  methods: { 
    async remove() {
      const i = this.func.tests.indexOf(this.test);
      if (i !== -1 && await getConfirmation({ pref: PREF_REMOVE_PROGRAM })) {
        this.func.tests.splice(i, 1);
      }
    },
    async edit() {
      const { func, test, registry } = this;

      await getFuncTest({ func, test, registry });
    },
  },
});
</script>