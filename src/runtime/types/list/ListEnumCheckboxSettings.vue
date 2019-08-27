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
import { ListEnumCheckboxOptions } from './ListEnumCheckboxTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<ListEnumCheckboxOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'minWidth', type: 'number', label: 'Min Checkbox Width' },
];

export default TypeSettingsBase<EnumType, ListEnumCheckboxOptions>().extend({
  name: 'ListEnumCheckboxSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
