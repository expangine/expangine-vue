<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { MapType } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { MapGridOptions } from './MapGridTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<MapGridOptions> = [
  { name: 'title', type: 'text', label: 'Title', defaultValue: '' },
  { name: 'minKeyWidth', type: 'number', label: 'Minimum Key Column Width', required: true },
  { name: 'minValueWidth', type: 'number', label: 'Minimum Value Column Width', required: true },
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

export default TypeSettingsBase<MapType, MapGridOptions>().extend({
  name: 'MapGridSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>