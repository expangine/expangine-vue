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
    v-model="computedValue"
  ></v-select>
</template>

<script lang="ts">
import { ListType, toArray, EnumType } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { confirm } from '../../../app/Confirm';
import { ListEnumSelectOptions } from './ListEnumSelectTypes';
import { ListSubs } from './ListTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListEnumSelectOptions, any[], ListSubs>(Array).extend({
  name: 'ListEnumSelect',
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
    enumType(): EnumType {
      return this.type.options.item as EnumType;
    },
    items(): ListOptions<any> {
      const constants = this.enumType.options.constants.entries();

      return toArray(constants).map(([text, value]) => ({ text, value }));
    },
  },
});
</script>