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
  { name: 'labelTrue', type: 'text', label: 'True Label' },
  { name: 'labelFalse', type: 'text', label: 'False Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
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
