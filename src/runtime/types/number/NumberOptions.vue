<template>
  <ex-simple-fields
    :value="type.options"
    :fields="optionFields"
    :read-only="readOnly"
    @input="update"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { NumberType, NumberOptions } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<NumberOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'whole', type: 'boolean', label: 'Whole', defaultValue: false },
];

export default TypeEditorBase<NumberType, any>().extend({
  name: 'NumberEditor',
  computed: {
    optionFields: () => fields,
  },
});
</script>