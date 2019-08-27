<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanRadioOptions } from './BooleanRadioTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<BooleanRadioOptions> = [
  { name: 'labelTrue', type: 'text', label: 'True Label' },
  { name: 'labelFalse', type: 'text', label: 'False Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
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
