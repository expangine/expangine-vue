<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { AnyType } from 'expangine-runtime';
import { AnyOptions } from './AnyTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<AnyOptions> = [
  { name: 'designLabel', type: 'text', label: 'Design Label', defaultValue: '' },
];

export default TypeSettingsBase<AnyType, AnyOptions>().extend({
  name: 'AnySettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>
