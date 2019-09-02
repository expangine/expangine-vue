<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { EnumType } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { ListEnumCheckboxOptions } from './ListEnumCheckboxTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<ListEnumCheckboxOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'offIcon', type: 'icon', label: 'Off Icon', details: 'default: Checkbox Blank Outline' },
  { name: 'onIcon', type: 'icon', label: 'On Icon', details: 'default: Checkbox Marked' },
  { name: 'indeterminateIcon', type: 'icon', label: 'Indeterminate Icon', details: 'default: Minus Box' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
  { name: 'minWidth', type: 'number', label: 'Min Checkbox Width', required: true },
];

export default TypeSettingsBase<EnumType, ListEnumCheckboxOptions>().extend({
  name: 'ListEnumCheckboxSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
