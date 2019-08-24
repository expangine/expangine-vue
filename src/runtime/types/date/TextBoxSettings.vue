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
        label="Dark"
        v-model="value.dark"
        @change="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Filled"
        v-model="value.filled"
        @change="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Solo"
        v-model="value.solo"
        @change="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Outlined"
        v-model="value.outlined"
        @change="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Flat"
        v-model="value.flat"
        @change="input"
      ></v-checkbox>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { DateType } from 'expangine-runtime';
import { TextBoxOptions } from './TextBoxTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<DateType, TextBoxOptions>().extend({
  name: 'DateTextBoxSettings',
});
</script>

<style lang="sass" scoped>

</style>
