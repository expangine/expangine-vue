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
  { name: 'title', type: 'text', label: 'Title', defaultValue: '' },
  { name: 'itemName', type: 'text', label: 'Item Name', defaultValue: 'Item' },
  { name: 'hideRemove', type: 'boolean', label: 'Hide Remove', defaultValue: false },
  { name: 'hideInsert', type: 'boolean', label: 'Hide Insert', defaultValue: false },
  { name: 'hideSort', type: 'boolean', label: 'Hide Sort', defaultValue: false },
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
