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
        label="Dense"
        v-model="value.dense"
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
import { BooleanType } from 'expangine-runtime';
import { BooleanSelectOptions } from './BooleanSelectTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<BooleanType, BooleanSelectOptions>().extend({
  
});
</script>

<style lang="sass" scoped>

</style>
