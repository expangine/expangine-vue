<template>
  <v-slider
    class="mt-4"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :disabled="readOnly"
    :error="invalid"
    :min="type.options.min"
    :max="type.options.max"
    :value="value"
    v-bind="settings.options"
    @input="input"
  ></v-slider>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { SliderOptions } from './SliderTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<NumberType, SliderOptions, number | string>([Number, String]).extend({
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
