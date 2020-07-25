<template>
  <v-select
    v-bind="settings.options"
    multiple
    :items="bitItems"
    :return-object="false"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model="computedValueBits"
  ></v-select>
</template>

<script lang="ts">
import { NumberType } from 'expangine-runtime';
import { NumberBitDropdownOptions } from './NumberBitDropdownTypes';
import { ListOptions } from '../../../common';
import TypeInputBase from '../TypeInputBase';


/* tslint:disable:no-bitwise */

export default TypeInputBase<NumberType, NumberBitDropdownOptions, number>(Number).extend({
  name: 'NumberBitDropdown',
  computed: {
    bitItems(): ListOptions<number> {
      return this.settings.options.items.map((option) => ({
        text: option.text,
        value: 1 << (option.value - 1),
      }));
    },
    computedValueBits: {
      get(): number[] {
        const bits: number[] = [];
        let value = this.computedValue;
        let bit = 1;

        while (value > 0) {
          if ((value & bit) !== 0) {
            bits.push(bit);
            value ^= bit;
          }
          bit <<= 1;
        }

        return bits;
      },
      set(bits: number[]) {
        let value = 0;

        for (const bit of bits) {
          value |= bit;
        }

        this.computedValue = value;
      },
    },
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
  },
});
</script>