<template>
  <ex-simple-fields
    :value="type.options"
    :fields="optionFields"
    :read-only="readOnly"
    @input="update"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { ColorType, ColorOptions } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<ColorOptions> = [
  { name: 'hasAlpha', type: 'boolean', label: 'Has Alpha' },
];

export default TypeEditorBase<ColorType, any>().extend({
  name: 'ColorOptions',
  computed: {
    optionFields: () => fields,
  },
});
</script>