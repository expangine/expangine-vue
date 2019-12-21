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
            v-model="listValue"
          ></v-checkbox>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { SetType, EnumType } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { TypeSettings } from '../TypeVisuals';
import { SetEnumCheckboxOptions } from './SetEnumCheckboxTypes';
import { SetSubs } from './SetTypes';
import TypeInputBase from '../TypeInputBase';


const MIN_INPUT_WIDTH = 1000;
const GRID_COLUMNS = 12;

export default TypeInputBase<SetType, SetEnumCheckboxOptions, Set<any>, SetSubs>(Set).extend({
  name: 'SetEnumCheckbox',
  data: () => ({
    width: 1,
  }),
  computed: {
    listValue: {
      get(): any[] {
        return Array.from(this.computedValue);
      },
      set(list: any[]) {
        this.computedValue = new Set(list);
      },
    },
    themeClass(): string {
      return this.settings.options.dark
        ? 'theme--dark'
        : 'theme--light';
    },
    enumType(): EnumType {
      return this.type.options.value as EnumType;
    },
    entries(): Array<[any, any]> {
      return Array.from(this.enumType.options.constants.entries());
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
