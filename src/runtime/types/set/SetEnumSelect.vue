<template>
  <v-select
    v-bind="settings.options"
    multiple
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :clearable="clearable"
    :items="items"
    v-model="listValue"
  ></v-select>
</template>

<script lang="ts">
import { SetType, EnumType } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { SetEnumSelectOptions } from './SetEnumSelectTypes';
import { SetSubs } from './SetTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<SetType, SetEnumSelectOptions, Set<any>, SetSubs>(Set).extend({
  name: 'SetEnumSelect',
  computed: {
    listValue: {
      get(): any[] {
        return Array.from(this.computedValue);
      },
      set(list: any[]) {
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
    enumType(): EnumType {
      return this.type.options.value as EnumType;
    },
    items(): ListOptions<any> {
      const constants = this.enumType.options.constants.entries();

      return Array.from(constants).map(([text, value]) => ({ text, value }));
    },
  },
});
</script>