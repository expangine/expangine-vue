<template>
  <ex-simple-fields
    :fields="optionFields"
    :read-only="readOnly"
    v-model="computedValue"
  ></ex-simple-fields>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { NumberSliderOptions } from './NumberSliderTypes';
import TypeSettingsBase from '../TypeSettingsBase';
import { ListOptions, SimpleFieldSettings } from '../../../common';


const thumbLabelOptions: ListOptions<string | boolean> = [
  { text: 'None', value: false },
  { text: 'Show on drag', value: true },
  { text: 'Show always', value: 'always' },
];

const fields: SimpleFieldSettings<NumberSliderOptions> = [
  { name: 'label', type: 'text', label: 'Label', defaultValue: '' },
  { name: 'hint', type: 'text', label: 'Hint', defaultValue: '' },
  { name: 'prependIcon', type: 'icon', label: 'Prepend Icon' },
  { name: 'appendIcon', type: 'icon', label: 'Append Icon' },
  { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  { name: 'color', type: 'color', label: 'Color' },
  { name: 'thumbColor', type: 'color', label: 'Thumb Color' },
  { name: 'trackColor', type: 'color', label: 'Track Color' },
  { name: 'trackFillColor', type: 'color', label: 'Track Fill Color' },
  { name: 'step', type: 'number', label: 'Step', defaultValue: 1 },
  { name: 'thumbLabel', type: 'select', label: 'Thumb Label', items: thumbLabelOptions },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
];

export default TypeSettingsBase<NumberType, NumberSliderOptions>().extend({
  name: 'NumberSliderSettings',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
