<template>
  <v-list>
    <v-list-item>
      <v-text-field
        filled
        label="Label"
        v-model="value.label"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-select
        filled
        label="Type"
        v-model="value.type"
        :items="typeOptions"
        @input="input"
      ></v-select>
    </v-list-item>
    <v-list-item>
      <v-select
        filled
        label="Auto Complete"
        :items="autocompleteOptions"
        v-model="value.autocomplete"
        @input="input"
      ></v-select>
    </v-list-item>
    <v-list-item>
      <v-text-field
        filled
        label="Hint"
        v-model="value.hint"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-text-field
        filled
        label="Prefix"
        v-model="value.prefix"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-text-field
        filled
        label="Suffix"
        v-model="value.suffix"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-text-field
        filled
        clearable
        hide-details
        type="number"
        label="Counter"
        v-model="value.counter"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Clearable"
        v-model="value.clearable"
        @input="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Dark"
        v-model="value.dark"
        @input="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Filled"
        v-model="value.filled"
        @input="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Solo"
        v-model="value.solo"
        @input="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Outlined"
        v-model="value.outlined"
        @input="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Flat"
        v-model="value.flat"
        @input="input"
      ></v-checkbox>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextBoxOptions } from './TextBoxTypes';
import TypeSettingsBase from '../TypeSettingsBase';
import { ListOptions } from '../../../common';


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

export default TypeSettingsBase<TextType, TextBoxOptions>().extend({
  computed: {
    typeOptions: () => typeOptions,
    autocompleteOptions: () => autocompleteOptions,
  },
});
</script>

<style lang="sass" scoped>

</style>
