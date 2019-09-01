<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextBoxOptions } from './TextBoxTypes';
import { ListOptions, SimpleFieldSettings } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const typeOptions: ListOptions = [
  { text: 'Text', value: 'text' },
  { text: 'Email', value: 'email' },
  { text: 'Date', value: 'date' },
  { text: 'Time', value: 'time' },
  { text: 'Password', value: 'password' },
  { text: 'Telephone', value: 'tel' },
  { text: 'Number', value: 'number' },
  { text: 'Color', value: 'color' },
];

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

const fields: SimpleFieldSettings<TextBoxOptions> = [
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'type', type: 'select', label: 'Type', items: typeOptions },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'prefix', type: 'text', label: 'Prefix' },
  { name: 'suffix', type: 'text', label: 'Suffix' },
  { name: 'placeholder', type: 'text', label: 'Placeholder' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'prependInnerIcon', type: 'icon', label: 'Prepend Inner Icon' },
  { name: 'appendOuterIcon', type: 'icon', label: 'Append Outer Icon' },
  { name: 'clearIcon', type: 'icon', label: 'Clear Icon', details: 'default: Close' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'autocomplete', type: 'select', label: 'Autocomplete', items: autocompleteOptions },
  { name: 'counter', type: 'boolean', label: 'Counter' },
  { name: 'singleLine', type: 'boolean', label: 'Single Line' },
  { name: 'clearable', type: 'boolean', label: 'Clearable' },
  { name: 'dark', type: 'boolean', label: 'Dark' },
  { name: 'filled', type: 'boolean', label: 'Filled' },
  { name: 'solo', type: 'boolean', label: 'Solo' },
  { name: 'outlined', type: 'boolean', label: 'Outlined' },
  { name: 'dense', type: 'boolean', label: 'Dense' },
  { name: 'flat', type: 'boolean', label: 'Flat' },
];

export default TypeSettingsBase<TextType, TextBoxOptions>().extend({
  name: 'TextBoxSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
