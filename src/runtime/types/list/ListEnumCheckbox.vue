<template>
  <v-container 
    fluid 
    ref="parent" 
    class="pa-0" 
    v-resize="updateWidth"
  >
    <v-row dense>
      <v-col>
        <div class="v-label" :class="themeClass">{{ settings.options.label }}</div>
      </v-col>
    </v-row>
    <v-row dense>
      <template v-for="constant in entries">
        <v-col :key="constant[0]" :cols="columns">
          <v-checkbox
            class="mt-0"
            hide-details
            :readonly="readOnly"
            :error="invalid"
            :label="constant[0]"
            :value="constant[1]"
            v-model="computedValue"
          ></v-checkbox>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ListType, toArray, EnumType } from 'expangine-runtime';
import { ListOptions, PropTypeAny } from '../../../common';
import { TypeSettings } from '../../TypeVisuals';
import { ListEnumCheckboxOptions } from './ListEnumCheckboxTypes';
import { ListSubs } from './ListTypes';
import TypeInputBase from '../TypeInputBase';


const MIN_INPUT_WIDTH = 1000;
const GRID_COLUMNS = 12;

export default TypeInputBase<ListType, ListEnumCheckboxOptions, any[], ListSubs>(Array).extend({
  name: 'ListEnumCheckbox',
  data: () => ({
    width: 1,
  }),
  computed: {
    themeClass(): string {
      return this.settings.options.dark
        ? 'theme--dark'
        : 'theme--light';
    },
    enumType(): EnumType {
      return this.type.options.item as EnumType;
    },
    entries(): Array<[any, any]> {
      return toArray(this.enumType.options.constants.entries());
    },
    minWidth(): number {
      return this.settings.options.minWidth || MIN_INPUT_WIDTH;
    },
    columns(): number {
      return Math.floor(this.minWidth / this.width * GRID_COLUMNS);
    },
  },
  methods: {
    updateWidth() {
      const el = this.$refs.parent as HTMLElement;
      this.width = el.offsetWidth;
    },
  },
});
</script>
