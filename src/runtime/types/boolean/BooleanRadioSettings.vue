<template>
  <v-list>
    <v-list-item>
      <v-text-field
        filled
        label="True Label"
        v-model="value.labelTrue"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-text-field
        filled
        label="False Label"
        v-model="value.labelFalse"
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
        @change="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Row"
        v-model="value.row"
        @change="input"
      ></v-checkbox>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { BooleanType } from 'expangine-runtime';
import { BooleanRadioOptions } from './BooleanRadioTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<BooleanType, BooleanRadioOptions>().extend({
  name: 'BooleanRadioSettings',
});
</script>

<style lang="sass" scoped>

</style>
