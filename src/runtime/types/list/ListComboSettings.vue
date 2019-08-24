<template>
  <ex-simple-fields
    :value="value"
    :fields="optionFields"
    :read-only="readOnly"
    @input="input"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { ListType } from 'expangine-runtime';
import { ListComboOptions } from './ListComboTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<ListComboOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'items', type: 'combo', label: 'Available Values' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'prefix', type: 'text', label: 'Prefix' },
  { name: 'suffix', type: 'text', label: 'Suffix' },
  { name: 'placeholder', type: 'text', label: 'Placeholder' },
  { name: 'chips', type: 'boolean', label: 'Chips' },
  { name: 'smallChips', type: 'boolean', label: 'Small Chips' },
  { name: 'deletableChips', type: 'boolean', label: 'Deletable Chips' },
  { name: 'singleLine', type: 'boolean', label: 'Single Line' },
  { name: 'clearable', type: 'boolean', label: 'Clearable' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'filled', type: 'boolean', label: 'Filled' },
  { name: 'solo', type: 'boolean', label: 'Solo' },
  { name: 'outlined', type: 'boolean', label: 'Outlined' },
  { name: 'dense', type: 'boolean', label: 'Dense' },
  { name: 'flat', type: 'boolean', label: 'Flat' },
];

export default TypeSettingsBase<ListType, ListComboOptions>().extend({
  name: 'ListComboSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
