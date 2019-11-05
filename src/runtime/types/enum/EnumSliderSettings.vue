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
import { EnumSliderOptions } from './EnumSliderTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<EnumSliderOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'thumbColor', type: 'color', label: 'Thumb Color' },
  { name: 'trackColor', type: 'color', label: 'Track Color' },
  { name: 'trackFillColor', type: 'color', label: 'Track Fill Color' },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
  { name: 'filled', type: 'boolean', label: 'Filled', defaultValue: false },
  { name: 'solo', type: 'boolean', label: 'Solo', defaultValue: false },
  { name: 'outlined', type: 'boolean', label: 'Outlined', defaultValue: false },
  { name: 'dense', type: 'boolean', label: 'Dense', defaultValue: false },
  { name: 'flat', type: 'boolean', label: 'Flat', defaultValue: false },
];

export default TypeSettingsBase<EnumType, EnumSliderOptions>().extend({
  name: 'EnumDropdownSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>