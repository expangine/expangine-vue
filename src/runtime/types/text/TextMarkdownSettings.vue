<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextMarkdownOptions } from './TextMarkdownTypes';
import { SimpleFieldSettings, ListOptions } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<TextMarkdownOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'placeholder', type: 'text', label: 'Placeholder', defaultValue: '' },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'html', type: 'boolean', label: 'Allow HTML?', defaultValue: true },
  { name: 'linkify', type: 'boolean', label: 'Auto create Links?', defaultValue: true },
  { name: 'emoji', type: 'boolean', label: 'Auto create Emojis?', defaultValue: true },
  { name: 'typographer', type: 'boolean', label: 'Auto convert special symbols?', defaultValue: true },
];

export default TypeSettingsBase<TextType, TextMarkdownOptions>().extend({
  name: 'TextMarkdownSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>