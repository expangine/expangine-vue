<template>
  <v-combobox
    v-bind="settings.options"
    multiple
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :clearable="clearable"
    v-model="computedValue"
  ></v-combobox>
</template>

<script lang="ts">
import { ListType } from 'expangine-runtime';
import { ListComboOptions } from './ListComboTypes';
import { ListSubs } from './ListTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListComboOptions, string[], ListSubs>(Array).extend({
  name: 'ListCombo',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    clearable(): boolean {
      return !(this.readOnly || !this.settings.options.clearable);
    },
  },
});
</script>