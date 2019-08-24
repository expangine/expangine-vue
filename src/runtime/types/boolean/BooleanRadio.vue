<template>
  <v-radio-group
    :read-only="readOnly"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :value="value"
    v-bind="settings.options"
    @change="input"
  >
    <v-radio 
      :label="settings.options.labelTrue" 
      :value="true"
    ></v-radio>

    <v-radio 
      :label="settings.options.labelFalse" 
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
