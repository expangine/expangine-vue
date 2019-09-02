<template>
  <v-combobox
    v-bind="settings.options"
    :return-object="false"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model.number="computedValue"
  ></v-combobox>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { NumberComboOptions } from './NumberComboTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<NumberType, NumberComboOptions, number>(Number).extend({
  name: 'NumberCombo',
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