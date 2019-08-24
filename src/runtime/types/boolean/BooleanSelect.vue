<template>
  <v-select
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :items="items"
    :value="value"
    @input="input"
  ></v-select>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { BooleanSelectOptions } from './BooleanSelectTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<BooleanType, BooleanSelectOptions, boolean>(Boolean).extend({
  name: 'BooleanSelect',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    items(): ListOptions<boolean> {
      return [
        { text: this.settings.options.labelTrue, value: true },
        { text: this.settings.options.labelFalse, value: false },
      ];
    },
  },
});
</script>

<style lang="sass" scoped>

</style>
