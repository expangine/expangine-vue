<template>
  <v-slider
    v-bind="settings.options"
    ticks="always"
    tick-size="4"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :tick-labels="keys"
    :min="0"
    :max="max"
    v-model="sliderValue"
  ></v-slider>
</template>

<script lang="ts">
import { EnumType, toArray } from 'expangine-runtime';
import { EnumSliderOptions } from './EnumSliderTypes';
import { TypeSettings } from '../TypeVisuals';
import { EnumSubs } from './EnumTypes';
import { ListOptions, PropTypeAny } from '../../../common';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<EnumType, EnumSliderOptions, any, EnumSubs>(PropTypeAny).extend({
  name: 'EnumSlider',
  computed: {
    sliderValue: {
      get(): number {
        return this.values.indexOf(this.computedValue);
      },
      set(index: number) {
        this.computedValue = this.values[index];
      },
    },
    entries(): Array<[any, any]> {
      return toArray(this.type.options.constants.entries());
    },
    keys(): any[] {
      return this.entries.map(([k, v]) => k);
    },
    values(): any[] {
      return this.entries.map(([k, v]) => v);
    },
    max(): number {
      return this.keys.length - 1;
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
