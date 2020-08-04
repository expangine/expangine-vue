<template>
  <v-select
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :items="items"
    v-model="computedValue"
  ></v-select>
</template>

<script lang="ts">
import { EnumType } from 'expangine-runtime';
import { EnumSelectOptions } from './EnumSelectTypes';
import { EnumSubs } from './EnumTypes';
import { ListOptions } from '../../../common';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<EnumType, EnumSelectOptions, any, EnumSubs>().extend({
  name: 'EnumSelect',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    items(): ListOptions<any> {
      const constants = this.type.options.constants.entries();

      return Array.from(constants).map(([text, value]) => ({ text, value }));
    },
  },
});
</script>
