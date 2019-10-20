<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { ColorType } from 'expangine-runtime';
import { ColorPickerOptions } from './ColorPickerTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';



const fields: SimpleFieldSettings<ColorPickerOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'prependInnerIcon', type: 'icon', label: 'Prepend Inner Icon' },
  { name: 'appendOuterIcon', type: 'icon', label: 'Append Outer Icon' },
  { name: 'clearIcon', type: 'icon', label: 'Clear Icon', details: 'default: Close' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
  { name: 'filled', type: 'boolean', label: 'Filled', defaultValue: false },
  { name: 'solo', type: 'boolean', label: 'Solo', defaultValue: false },
  { name: 'outlined', type: 'boolean', label: 'Outlined', defaultValue: false },
  { name: 'dense', type: 'boolean', label: 'Dense', defaultValue: false },
  { name: 'flat', type: 'boolean', label: 'Flat', defaultValue: false },
  { name: 'showSwatches', type: 'boolean', label: 'Show Swatches', defaultValue: false },
  { name: 'mode', type: 'select', label: 'Mode', defaultValue: 'rgba', items: [
    { text: 'RGBA', value: 'rgba' },
    { text: 'HSLA', value: 'hsla' },
    { text: 'HEXA', value: 'hexa' },
  ]},
  { name: 'hideCanvas', type: 'boolean', label: 'Hide Canvas', defaultValue: false },
  { name: 'hideModeSwitch', type: 'boolean', label: 'Hide Mode Switch', defaultValue: false },
  { name: 'hideInputs', type: 'boolean', label: 'Hide Inputs', defaultValue: false },
];

export default TypeSettingsBase<ColorType, ColorPickerOptions>().extend({
  name: 'ColorPickerSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>