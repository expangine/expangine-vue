<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextAreaOptions } from './TextAreaTypes';
import { SimpleFieldSettings, ListOptions } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const autocompleteOptions: ListOptions = [
  { text: 'None', value: 'new-password' },
  { text: 'Email', value: 'email' },
  { text: 'Username', value: 'username' },
  { text: 'Current Password', value: 'current-password' },
  { text: 'Organization', value: 'organization' },
  { text: 'Organization Title', value: 'organization-title' },
  { text: 'Name', value: 'name' },
  { text: 'Honorific Prefix', value: 'honorific-prefix' },
  { text: 'Given Name', value: 'given-name' },
  { text: 'Middle Name', value: 'additional-name' },
  { text: 'Family Name', value: 'family-name' },
  { text: 'Honorific Suffix', value: 'honorific-suffix' },
  { text: 'Nickname', value: 'nickname' },
  { text: 'Street Address', value: 'street-address' },
  { text: 'Address Line 1', value: 'address-line1' },
  { text: 'Address Line 2', value: 'address-line2' },
  { text: 'Address Line 3', value: 'address-line3' },
  { text: 'Country Code', value: 'country' },
  { text: 'Country Name', value: 'country-name' },
  { text: 'Postal Code', value: 'postal-code' },
  { text: 'Language', value: 'language' },
  { text: 'Birthday', value: 'bday' },
  { text: 'URL', value: 'url' },
  { text: 'Telephone Global', value: 'tel' },
  { text: 'Telephone Local', value: 'tel-national' },
];

const fields: SimpleFieldSettings<TextAreaOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'prefix', type: 'text', label: 'Prefix' },
  { name: 'suffix', type: 'text', label: 'Suffix' },
  { name: 'placeholder', type: 'text', label: 'Placeholder' },
  { name: 'rows', type: 'number', label: 'Rows' },
  { name: 'rowHeight', type: 'number', label: 'Row Height' },
  { name: 'autocomplete', type: 'text', label: 'Autocomplete', items: autocompleteOptions },
  { name: 'autoGrow', type: 'boolean', label: 'Auto Grow' },
  { name: 'counter', type: 'boolean', label: 'Counter' },
  { name: 'clearable', type: 'boolean', label: 'Clearable' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'filled', type: 'boolean', label: 'Filled' },
  { name: 'solo', type: 'boolean', label: 'Solo' },
  { name: 'outlined', type: 'boolean', label: 'Outlined' },
  { name: 'dense', type: 'boolean', label: 'Dense' },
  { name: 'flat', type: 'boolean', label: 'Flat' },
];

export default TypeSettingsBase<TextType, TextAreaOptions>().extend({
  name: 'TextAreaSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
