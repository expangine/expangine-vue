<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextRadioOptions } from './TextRadioTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<TextRadioOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'otherLabel', type: 'text', label: 'Other Label', required: true },
  { name: 'items', type: 'combo', label: 'Available Values', required: true },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'prefix', type: 'text', label: 'Prefix', defaultValue: '' },
  { name: 'suffix', type: 'text', label: 'Suffix', defaultValue: '' },
  { name: 'placeholder', type: 'text', label: 'Placeholder', defaultValue: '' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'offIcon', type: 'icon', label: 'Off Icon', details: 'default: Radiobox Blank' },
  { name: 'onIcon', type: 'icon', label: 'On Icon', details: 'default: Radiobox Marked' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'singleLine', type: 'boolean', label: 'Single Line', defaultValue: false },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
  { name: 'filled', type: 'boolean', label: 'Filled', defaultValue: false },
  { name: 'solo', type: 'boolean', label: 'Solo', defaultValue: false },
  { name: 'outlined', type: 'boolean', label: 'Outlined', defaultValue: false },
  { name: 'dense', type: 'boolean', label: 'Dense', defaultValue: false },
  { name: 'flat', type: 'boolean', label: 'Flat', defaultValue: false },
];

export default TypeSettingsBase<TextType, TextRadioOptions>().extend({
  name: 'TextRadioSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>