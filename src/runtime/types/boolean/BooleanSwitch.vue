<template>
  <v-switch
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :error="invalid"
    :readonly="readOnly"
    :value="value"
    :true-value="true"
    :false-value="false"
    @change="input"
  ></v-switch>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanSwitchOptions } from './BooleanSwitchTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<BooleanType, BooleanSwitchOptions, boolean>(Boolean).extend({
  name: 'BooleanSwitch',
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
