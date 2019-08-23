<template>
  <ex-date-picker
    :value="valueDate"
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


export default TypeInputBase<DateType, PickerOptions, Date | string>([Date, String]).extend({
  computed: {
    valueDate: {
      get(): string {
        return formatDate(this.value, '', this.type.options.withTime);
      },
      set(value: string) {
        if (!value) {
          this.input(new Date());
        } else {
          const [year, month, date, hour, minute, second] = value.split(/[-\s:]/);

          this.input(new Date(
            parseInt(year, 10), 
            parseInt(month, 10) - 1, 
            parseInt(date, 10),
            parseInt(hour, 10) || 0,
            parseInt(minute, 10) || 0,
            parseInt(second, 10) || 0,
          ));
        }
      },
    },
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
  methods: {
    
  },
});
</script>

<style lang="sass" scoped>

</style>
