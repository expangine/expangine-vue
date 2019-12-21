<template>
  <v-combobox
    v-bind="settings.options"
    multiple
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :clearable="clearable"
    v-model="listValue"
  ></v-combobox>
</template>

<script lang="ts">
import { SetType } from 'expangine-runtime';
import { SetComboOptions } from './SetComboTypes';
import { SetSubs } from './SetTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<SetType, SetComboOptions, Set<string>, SetSubs>(Set).extend({
  name: 'SetCombo',
  computed: {
    listValue: {
      get(): string[] {
        return Array.from(this.computedValue);
      },
      set(list: string[]) {
        this.computedValue = new Set(list);
      },
    },
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