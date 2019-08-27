<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanCheckboxOptions } from './BooleanCheckboxTypes';
import TypeSettingsBase from '../TypeSettingsBase';
import { SimpleFieldSettings } from '../../../common';


const fields: SimpleFieldSettings<BooleanCheckboxOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
];

export default TypeSettingsBase<BooleanType, BooleanCheckboxOptions>().extend({
  name: 'BooleanCheckboxSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
