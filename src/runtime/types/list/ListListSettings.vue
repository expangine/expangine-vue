<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { ListType } from 'expangine-runtime';
import { ListListOptions } from './ListListTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<ListListOptions> = [
  { name: 'title', type: 'text', label: 'Title' },
  { name: 'itemName', type: 'text', label: 'Item Name' },
  { name: 'hideRemove', type: 'boolean', label: 'Hide Remove' },
  { name: 'hideInsert', type: 'boolean', label: 'Hide Insert' },
  { name: 'hideSort', type: 'boolean', label: 'Hide Sort' },
];

export default TypeSettingsBase<ListType, ListListOptions>().extend({
  name: 'ListListSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
