<template>
  <v-checkbox
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :value="value"
    :true-value="true"
    :false-value="false"
    v-bind="settings.options"
    @change="input"
  ></v-checkbox>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanCheckboxOptions } from './BooleanCheckboxTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<BooleanType, BooleanCheckboxOptions, boolean>(Boolean).extend({
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
