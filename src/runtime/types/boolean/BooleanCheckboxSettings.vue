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
        hide-details
        label="Hint"
        v-model="value.hint"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Dark"
        v-model="value.dark"
        @input="input"
      ></v-checkbox>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanCheckboxOptions } from './BooleanCheckboxTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<BooleanType, BooleanCheckboxOptions>().extend({
  
});
</script>

<style lang="sass" scoped>

</style>
