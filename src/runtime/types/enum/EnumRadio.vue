<template>
  <v-radio-group
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model="computedValue">
    <template v-for="constant in entries">
      <v-radio
        :key="constant[0]"
        :label="constant[0]"
        :value="constant[1]"
        :off-icon="settings.options.offIcon"
        :on-icon="settings.options.onIcon"
        :color="settings.options.color"
      ></v-radio>
    </template>
  </v-radio-group>
</template>

<script lang="ts">
import { EnumType, toArray } from 'expangine-runtime';
import { EnumRadioOptions } from './EnumRadioTypes';
import { TypeSettings } from '../TypeVisuals';
import { EnumSubs } from './EnumTypes';
import { ListOptions, PropTypeAny } from '../../../common';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<EnumType, EnumRadioOptions, any, EnumSubs>(PropTypeAny).extend({
  name: 'EnumRadio',
  computed: {
    entries(): Array<[any, any]> {
      return toArray(this.type.options.constants.entries());
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
