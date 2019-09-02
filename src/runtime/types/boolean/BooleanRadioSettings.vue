<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { BooleanRadioOptions } from './BooleanRadioTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<BooleanRadioOptions> = [
  { name: 'labelTrue', type: 'text', label: 'True Label', required: true },
  { name: 'labelFalse', type: 'text', label: 'False Label', required: true },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'offIcon', type: 'icon', label: 'Off Icon', details: 'default: Radiobox Blank' },
  { name: 'onIcon', type: 'icon', label: 'On Icon', details: 'default: Radiobox Marked' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'row', type: 'boolean', label: 'Row' },
];

export default TypeSettingsBase<BooleanType, BooleanRadioOptions>().extend({
  name: 'BooleanRadioSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
