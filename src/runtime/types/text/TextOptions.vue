<template>
  <ex-simple-fields
    remove-empty
    :value="type.options"
    :fields="optionFields"
    :read-only="readOnly"
    @input="updateType"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { TextType, TextOptions } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<TextOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'requireUpper', type: 'boolean', label: 'Require Upper'},
  { name: 'requireLower', type: 'boolean', label: 'Require Lower'},
  { name: 'forceUpper', type: 'boolean', label: 'Force Upper'},
  { name: 'forceLower', type: 'boolean', label: 'Force Lower'},
];

export default TypeEditorBase<TextType, any>().extend({
  name: 'TextOptions',
  computed: {
    optionFields: () => fields,
  },
});
</script>