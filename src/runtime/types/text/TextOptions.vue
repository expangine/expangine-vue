<template>
  <ex-simple-fields
    :value="type.options"
    :fields="optionFields"
    :read-only="readOnly"
    @input="update"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { TextType, TextOptions } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<TextOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'requireUpper', type: 'boolean', label: 'Require Upper', defaultValue: false },
  { name: 'requireLower', type: 'boolean', label: 'Require Lower', defaultValue: false },
  { name: 'forceUpper', type: 'boolean', label: 'Force Upper', defaultValue: false },
  { name: 'forceLower', type: 'boolean', label: 'Force Lower', defaultValue: false},
];

export default TypeEditorBase<TextType, any>().extend({
  name: 'TextOptions',
  computed: {
    optionFields: () => fields,
  },
});
</script>