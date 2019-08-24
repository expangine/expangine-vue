<template>
  <ex-simple-fields
    :value="value"
    :fields="optionFields"
    :read-only="readOnly"
    @input="input"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanSwitchOptions } from './BooleanSwitchTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<BooleanSwitchOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'inset', type: 'boolean', label: 'Inset' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
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
