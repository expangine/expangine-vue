<template>
  <v-textarea
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :value="value"
    v-bind="settings.options"
    :clearable="clearable"
    :counter="counter"
    @input="input"
  ></v-textarea>
</template>

<script lang="ts">
import { TextType, isNumber } from 'expangine-runtime';
import { TextAreaOptions } from './TextAreaTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<TextType, TextAreaOptions, string>(String).extend({
  name: 'TextArea',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    clearable(): boolean {
      return !this.readOnly && this.settings.options.clearable;
    },
    counter(): number | boolean {
      return this.settings.options.counter
        ? isNumber(this.type.options.max)
          ? this.type.options.max
          : true
        : false;
    },
  },
});
</script>

<style lang="sass" scoped>

</style>
