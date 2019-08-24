<template>
  <v-combobox
    v-bind="settings.options"
    multiple
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :value="value"
    :clearable="clearable"
    @input="input"
  ></v-combobox>
</template>

<script lang="ts">
import { ListType } from 'expangine-runtime';
import { ListComboOptions, ListComboSubs } from './ListComboTypes';
import { confirm } from '../../../app/Confirm';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListComboOptions, string[], ListComboSubs>(Array).extend({
  name: 'ListCombo',
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
  },
});
</script>