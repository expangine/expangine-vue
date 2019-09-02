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
import { EnumSelectOptions } from './EnumSelectTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<EnumSelectOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'placeholder', type: 'text', label: 'Placeholder', defaultValue: '' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'prependInnerIcon', type: 'icon', label: 'Prepend Inner Icon' },
  { name: 'appendOuterIcon', type: 'icon', label: 'Append Outer Icon' },
  { name: 'clearIcon', type: 'icon', label: 'Clear Icon', details: 'default: Close' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'itemColor', type: 'color', label: 'Item Color' },
  { name: 'singleLine', type: 'boolean', label: 'Single Line', defaultValue: false },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
  { name: 'filled', type: 'boolean', label: 'Filled', defaultValue: false },
  { name: 'solo', type: 'boolean', label: 'Solo', defaultValue: false },
  { name: 'outlined', type: 'boolean', label: 'Outlined', defaultValue: false },
  { name: 'dense', type: 'boolean', label: 'Dense', defaultValue: false },
  { name: 'flat', type: 'boolean', label: 'Flat', defaultValue: false },
];

export default TypeSettingsBase<EnumType, EnumSelectOptions>().extend({
  name: 'EnumDropdownSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
