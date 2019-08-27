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
  { name: 'title', type: 'text', label: 'Title' },
  { name: 'minKeyWidth', type: 'number', label: 'Minimum Key Column Width' },
  { name: 'minValueWidth', type: 'number', label: 'Minimum Value Column Width' },
];

export default TypeSettingsBase<MapType, MapGridOptions>().extend({
  name: 'MapGridSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>