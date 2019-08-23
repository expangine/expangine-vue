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
        type="number"
        label="Step"
        v-model.number="value.step"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-select
        filled
        hide-details
        label="Thumb Label"
        :items="thumbLabelOptions"
        v-model="value.thumbLabel"
        @input="input"
      ></v-select>
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
import { NumberType } from 'expangine-runtime';
import { SliderOptions } from './SliderTypes';
import TypeSettingsBase from '../TypeSettingsBase';
import { ListOptions } from '../../../common';


const thumbLabelOptions: ListOptions<string | boolean> = [
  { text: 'None', value: false },
  { text: 'Show on drag', value: true },
  { text: 'Show always', value: 'always' },
];

export default TypeSettingsBase<NumberType, SliderOptions>().extend({
  computed: {
    thumbLabelOptions: () => thumbLabelOptions,
  },
});
</script>

<style lang="sass" scoped>

</style>
