<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { NumberComboOptions } from './NumberComboTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<NumberComboOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'items', type: 'items', label: 'Available Values', valueType: 'number' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'prefix', type: 'text', label: 'Prefix' },
  { name: 'suffix', type: 'text', label: 'Suffix' },
  { name: 'placeholder', type: 'text', label: 'Placeholder' },
  { name: 'singleLine', type: 'boolean', label: 'Single Line' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'filled', type: 'boolean', label: 'Filled' },
  { name: 'solo', type: 'boolean', label: 'Solo' },
  { name: 'outlined', type: 'boolean', label: 'Outlined' },
  { name: 'dense', type: 'boolean', label: 'Dense' },
  { name: 'flat', type: 'boolean', label: 'Flat' },
];

export default TypeSettingsBase<NumberType, NumberComboOptions>().extend({
  name: 'NumberComboSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
