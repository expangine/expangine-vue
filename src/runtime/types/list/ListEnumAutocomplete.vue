<template>
  <v-autocomplete
    v-bind="settings.options"
    multiple
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    :clearable="clearable"
    :items="items"
    v-model="computedValue"
  ></v-autocomplete>
</template>

<script lang="ts">
import { ListType, EnumType } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { ListSubs } from './ListTypes';
import { ListEnumAutocompleteOptions } from './ListEnumAutocompleteTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListEnumAutocompleteOptions, any[], ListSubs>(Array).extend({
  name: 'ListEnumAutocomplete',
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
    enumType(): EnumType {
      return this.type.options.item as EnumType;
    },
    items(): ListOptions<any> {
      const constants = this.enumType.options.constants.entries();

      return Array.from(constants).map(([text, value]) => ({ text, value }));
    },
  },
});
</script>