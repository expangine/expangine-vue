<template>
  <v-textarea
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :value="value"
    v-bind="settings.options"
    @input="input"
  ></v-textarea>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextAreaOptions } from './TextAreaTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<TextType, TextAreaOptions, string>(String).extend({
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
