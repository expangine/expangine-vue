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
  { name: 'paging', type: 'boolean', label: 'Pagination?', defaultValue: false },
  { name: 'pageSize', type: 'number', label: 'Page Size', required: true },
  { name: 'pagination', type: 'object', label: 'Pagination', fields: [
    { name: 'circle', type: 'boolean', label: 'Circular?' },
    { name: 'color', type: 'color', label: 'Color' },
    { name: 'totalVisible', type: 'number', label: 'Max Visible' },
    { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
    { name: 'nextIcon', type: 'icon', label: 'Next Icon' },
    { name: 'prevIcon', type: 'icon', label: 'Prev Icon' },
  ]},
];

export default TypeSettingsBase<ListType, ListListOptions>().extend({
  name: 'ListListSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>