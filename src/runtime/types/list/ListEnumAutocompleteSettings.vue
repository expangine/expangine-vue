<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { ListType } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { ListEnumAutocompleteOptions } from './ListEnumAutocompleteTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<ListEnumAutocompleteOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'prefix', type: 'text', label: 'Prefix' },
  { name: 'suffix', type: 'text', label: 'Suffix' },
  { name: 'placeholder', type: 'text', label: 'Placeholder' },
  { name: 'singleLine', type: 'boolean', label: 'Single Line' },
  { name: 'clearable', type: 'boolean', label: 'Clearable' },
  { name: 'chips', type: 'boolean', label: 'Chips' },
  { name: 'smallChips', type: 'boolean', label: 'Small Chips' },
  { name: 'deletableChips', type: 'boolean', label: 'Deletable Chips' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'filled', type: 'boolean', label: 'Filled' },
  { name: 'solo', type: 'boolean', label: 'Solo' },
  { name: 'outlined', type: 'boolean', label: 'Outlined' },
  { name: 'dense', type: 'boolean', label: 'Dense' },
  { name: 'flat', type: 'boolean', label: 'Flat' },
];

export default TypeSettingsBase<ListType, ListEnumAutocompleteOptions>().extend({
  name: 'ListEnumAutocompleteSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
