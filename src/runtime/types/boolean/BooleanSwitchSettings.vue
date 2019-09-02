<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanSwitchOptions } from './BooleanSwitchTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<BooleanSwitchOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'inset', type: 'boolean', label: 'Inset', defaultValue: false },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
];

export default TypeSettingsBase<BooleanType, BooleanSwitchOptions>().extend({
  name: 'BooleanSwitchSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
