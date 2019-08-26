<template>
  <v-slider
    v-bind="settings.options"
    class="mt-4"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :disabled="readOnly"
    :error="invalid"
    :min="type.options.min"
    :max="type.options.max"
    v-model.number="computedValue"
  ></v-slider>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { NumberSliderOptions } from './NumberSliderTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<NumberType, NumberSliderOptions, number | string>([Number, String]).extend({
  name: 'NumberSlider',
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
