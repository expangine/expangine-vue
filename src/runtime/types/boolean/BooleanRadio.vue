<template>
  <v-radio-group
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model="computedValue"
  >
    <v-radio 
      :label="settings.options.labelTrue" 
      :off-icon="settings.options.offIcon"
      :on-icon="settings.options.onIcon"
      :color="settings.options.color"
      :value="true"
    ></v-radio>

    <v-radio 
      :label="settings.options.labelFalse" 
      :off-icon="settings.options.offIcon"
      :on-icon="settings.options.onIcon"
      :color="settings.options.color"
      :value="false"
    ></v-radio>

  </v-radio-group>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanRadioOptions } from './BooleanRadioTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<BooleanType, BooleanRadioOptions, boolean>(Boolean).extend({
  name: 'BooleanRadio',
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
