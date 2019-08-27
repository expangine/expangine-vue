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
import { EnumRadioOptions } from './EnumRadioTypes';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<EnumRadioOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'row', type: 'boolean', label: 'Row' },
];

export default TypeSettingsBase<EnumType, EnumRadioOptions>().extend({
  name: 'EnumDropdownSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
