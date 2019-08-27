<template>
  <v-combobox
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model="computedValue"
  ></v-combobox>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextComboOptions } from './TextComboTypes';
import { confirm } from '../../../app/Confirm';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<TextType, TextComboOptions, string>(String).extend({
  name: 'TextCombo',
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