<template>
  <ex-color-picker
    :text-props="textProps"
    :picker-props="pickerProps"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :read-only="readOnly"
    v-model="pickerValue"
  ></ex-color-picker>
</template>

<script lang="ts">
import { ColorType, ColorSpaceRGB, Color } from 'expangine-runtime';
import { formatDate } from '../../../common';
import { ColorPickerOptions } from './ColorPickerTypes';
import TypeInputBase from '../TypeInputBase';


const { hexLong } = ColorSpaceRGB.formatMap;

export default TypeInputBase<ColorType, ColorPickerOptions, Color>(Object as () => Color).extend({
  name: 'ColorPicker',
  computed: {
    pickerValue: {
      get(): string {
        return hexLong.formatter(this.computedValue);
      },
      set(value: string) {
        const parsed = hexLong.parser(value);
        if (parsed) {
          this.computedValue = parsed;
        }
      },
    },
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
    textProps(): any {
      return this.settings.options;
    },
    pickerProps(): any {
      const { showSwatches, mode, hideCanvas, hideModeSwitch, hideInputs } = this.settings.options;

      return { showSwatches, mode, hideCanvas, hideModeSwitch, hideInputs };
    },
  },
});
</script>