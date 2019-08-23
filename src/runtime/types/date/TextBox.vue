<template>
  <v-text-field
    :type="inputType"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :value="value"
    v-bind="settings.options"
    @input="input"
  ></v-text-field>
</template>

<script lang="ts">
import { DateType } from 'expangine-runtime';
import { TextBoxOptions } from './TextBoxTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<DateType, TextBoxOptions, Date>(Date).extend({
  computed: {
    inputType(): string {
      return this.type.options.withTime ? 'datetime' : 'date';
    },
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
  },
});
</script>

<style lang="sass" scoped>

</style>
