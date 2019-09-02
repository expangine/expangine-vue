<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanSelectOptions } from './BooleanSelectTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<BooleanSelectOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'labelTrue', type: 'text', label: 'True Label', required: true },
  { name: 'labelFalse', type: 'text', label: 'False Label', required: true },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'prependInnerIcon', type: 'icon', label: 'Prepend Inner Icon' },
  { name: 'appendOuterIcon', type: 'icon', label: 'Append Outer Icon' },
  { name: 'clearIcon', type: 'icon', label: 'Clear Icon', details: 'default: Close' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'itemColor', type: 'color', label: 'Item Color' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'filled', type: 'boolean', label: 'Filled' },
  { name: 'solo', type: 'boolean', label: 'Solo' },
  { name: 'outlined', type: 'boolean', label: 'Outlined' },
  { name: 'dense', type: 'boolean', label: 'Dense' },
  { name: 'flat', type: 'boolean', label: 'Flat' },
];

export default TypeSettingsBase<BooleanType, BooleanSelectOptions>().extend({
  name: 'BooleanSelectSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
