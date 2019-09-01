<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { OptionalType } from 'expangine-runtime';
import { OptionalOptions } from './OptionalTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<OptionalOptions> = [
  { name: 'removeLabel', type: 'text', label: 'Remove Label' },
  { name: 'removeIcon', type: 'icon', label: 'Remove Icon' },
];

export default TypeSettingsBase<OptionalType, OptionalOptions>().extend({
  name: 'OptionalSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>
