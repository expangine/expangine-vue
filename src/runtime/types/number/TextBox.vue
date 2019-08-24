<template>
  <v-text-field
    v-bind="settings.options"
    type="number"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model="valueNumber"
    @blur="fix"
  ></v-text-field>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { TextBoxOptions } from './TextBoxTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<NumberType, TextBoxOptions, number | string>([Number, String]).extend({
  name: 'NumberTextBox',
  computed: {
    valueNumber: {
      get(): string {
        return isFinite(parseFloat(this.value as string)) ? this.value.toString() : '';
      },
      set(value: string) {
        this.input(parseFloat(value));
      },
    },
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

<style lang="sass" scoped>

</style>
