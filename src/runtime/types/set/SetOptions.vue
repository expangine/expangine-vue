<template>
  <ex-simple-fields
    :value="type.options"
    :fields="optionFields"
    :read-only="readOnly"
    @input="update"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { Type, SetOptions, SetType } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { TypeUpdateEvent } from '../TypeVisuals';
import { SetSubs } from './SetTypes';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<SetOptions> = [];

export default TypeEditorBase<SetType, any, SetSubs>().extend({
  name: 'SetOptions',
  computed: {
    optionFields: () => fields,
  },
});
</script>