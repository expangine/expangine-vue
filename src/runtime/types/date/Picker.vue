<template>
  <ex-date-picker
    :value="value"
    :with-time="type.options.withTime"
    :text-props="textProps"
    :date-props="dateProps"
    v-bind="settings.options"
    @input="input"
  ></ex-date-picker>
</template>

<script lang="ts">
import { DateType } from 'expangine-runtime';
import { formatDate } from '../../../common';
import { PickerOptions } from './PickerTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<DateType, PickerOptions, Date>(Date).extend({
  name: 'DatePicker',
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    dateProps(): object {
      const min = this.type.options.forceMin || this.type.options.validateMin;
      const max = this.type.options.forceMax || this.type.options.validateMax;

      return {
        min: formatDate(min, undefined),
        max: formatDate(max, undefined),
      };
    },
    textProps(): object {
      return {
        ...this.settings.options,
        readonly: true,
        prependInnerIcon: 'mdi-calendar',
        hideDetails: this.hideHint,
        persistentHint: this.hasHint,
        disabled: this.readOnly,
        error: this.invalid,
      };
    },
  },
});
</script>

<style lang="sass" scoped>

</style>
