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
  { name: 'label', type: 'text', label: 'Label' },
  { name: 'hint', type: 'text', label: 'Hint' },
  { name: 'step', type: 'number', label: 'Step' },
  { name: 'thumbLabel', type: 'select', label: 'Thumb Label', items: thumbLabelOptions },
  { name: 'dark', type: 'boolean', label: 'Dark' },
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
