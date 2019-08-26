<template>
  <v-checkbox
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model="computedValue"
  ></v-checkbox>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanCheckboxOptions } from './BooleanCheckboxTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<BooleanType, BooleanCheckboxOptions, boolean>(Boolean).extend({
  name: 'BooleanCheckbox',
  computed: {
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
