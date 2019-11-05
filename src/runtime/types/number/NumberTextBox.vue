<template>
  <v-text-field
    v-bind="settings.options"
    type="number"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model.number="computedValue"
    @blur="fix"
  ></v-text-field>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { NumberTextBoxOptions } from './NumberTextBoxTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<NumberType, NumberTextBoxOptions, number | string>([Number, String]).extend({
  name: 'NumberTextBox',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
  },
  methods: {
    fix() {
      const { whole } = this.type.options;
      if (whole) {
        const asInt = Math.floor(this.value as number);
        if (asInt !== this.value) {
          this.input(asInt);
        }
      }
    },
  },
});
</script>