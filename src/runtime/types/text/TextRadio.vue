<template>
  <v-radio-group
    v-bind="settings.options"
    :hide-details="hideHint"
    :persistent-hint="hasHint"
    :readonly="readOnly"
    :error="invalid"
    v-model="radioValue"
  >
    <template v-for="item in items">
      <v-radio
        :key="item"
        :label="item"
        :value="item"
        :off-icon="settings.options.offIcon"
        :on-icon="settings.options.onIcon"
        :color="settings.options.color"
      ></v-radio>
    </template>
    <v-radio
      :value="otherId"
      :off-icon="settings.options.offIcon"
      :on-icon="settings.options.onIcon"
      :color="settings.options.color"
    >
      <template #label>
        <v-text-field 
          v-bind="settings.options"
          hide-details
          :disabled="inItems"
          :label="settings.options.otherLabel"
          v-model="otherValue"
        ></v-text-field>
      </template>
    </v-radio> 
  </v-radio-group>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextRadioOptions } from './TextRadioTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<TextType, TextRadioOptions, string>(String).extend({
  name: 'TextRadio',
  data: () => ({
    otherId: Math.random() + '',
  }),
  computed: {
    radioValue: {
      get(): string {
        return this.inItemsOrEmpty ? this.computedValue : this.otherId;
      },
      set(value: string) {
        this.computedValue = value === this.otherId ? '' : value;
      },
    },
    otherValue: {
      get(): string {
        return this.inItemsOrEmpty ? '' : this.computedValue;
      },
      set(value: string) {
        this.computedValue = value;
      },
    },
    items(): string[] {
      return this.settings.options.items;
    },
    inItemsOrEmpty(): boolean {
      return this.inItems || this.computedValue === '';
    },
    inItems(): boolean {
      return this.items.indexOf(this.computedValue) !== -1;
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

<style lang="less" scoped>
.v-radio {
  & .v-input /deep/ .v-label {
    top: 18px;
  }
}
</style>