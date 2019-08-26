<template>
  <ex-simple-fields
    :value="value"
    :fields="optionFields"
    :read-only="readOnly"
    @input="input"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { EnumType } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { EnumAutocompleteOptions } from './EnumAutocompleteTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<EnumAutocompleteOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'filled', type: 'boolean', label: 'Filled' },
  { name: 'solo', type: 'boolean', label: 'Solo' },
  { name: 'outlined', type: 'boolean', label: 'Outlined' },
  { name: 'dense', type: 'boolean', label: 'Dense' },
  { name: 'flat', type: 'boolean', label: 'Flat' },
];

export default TypeSettingsBase<EnumType, EnumAutocompleteOptions>().extend({
  name: 'EnumDropdownSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
