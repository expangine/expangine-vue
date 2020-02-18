<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextHtmlOptions } from './TextHtmlTypes';
import { SimpleFieldSettings, ListOptions } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<TextHtmlOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'placeholder', type: 'text', label: 'Placeholder', defaultValue: '' },
  { name: 'maxHeight', type: 'text', label: 'Max Height' },
  { name: 'forcePlainTextOnPaste', type: 'boolean', label: 'Force Plain Text on Paste', defaultValue: false },
  { name: 'hideModules', type: 'object', label: 'Hide Modules',
    fields: [
      { name: 'bold', type: 'boolean', label: 'Bold', defaultValue: false },
      { name: 'italic', type: 'boolean', label: 'Italic', defaultValue: false },
      { name: 'underline', type: 'boolean', label: 'Underline', defaultValue: false },
      { name: 'justifyLeft', type: 'boolean', label: 'Align Left', defaultValue: false },
      { name: 'justifyCenter', type: 'boolean', label: 'Align Center', defaultValue: false },
      { name: 'justifyRight', type: 'boolean', label: 'Align Right', defaultValue: false },
      { name: 'headings', type: 'boolean', label: 'Headings', defaultValue: false },
      { name: 'link', type: 'boolean', label: 'Links', defaultValue: false },
      { name: 'code', type: 'boolean', label: 'Code', defaultValue: false },
      { name: 'orderedList', type: 'boolean', label: 'Number List', defaultValue: false },
      { name: 'unorderedList', type: 'boolean', label: 'Bullet List', defaultValue: false },
      { name: 'image', type: 'boolean', label: 'Image', defaultValue: false },
      { name: 'table', type: 'boolean', label: 'Table', defaultValue: false },
      { name: 'removeFormat', type: 'boolean', label: 'Remove Format', defaultValue: false },
      { name: 'separator', type: 'boolean', label: 'Separator', defaultValue: false },
    ],
  },
];

export default TypeSettingsBase<TextType, TextHtmlOptions>().extend({
  name: 'TextHtmlSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>