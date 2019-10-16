<template>
  <ex-simple-fields
    :value="type.options"
    :fields="optionFields"
    :read-only="readOnly"
    @input="update()"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { Type, ListType, ListOptions } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { TypeUpdateEvent } from '../TypeVisuals';
import { ListSubs } from './ListTypes';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<ListOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
];

export default TypeEditorBase<ListType, any, ListSubs>().extend({
  name: 'ListOptions',
  computed: {
    optionFields: () => fields,
  },
});
</script>