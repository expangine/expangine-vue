<template>
  <v-list-item>
    <v-list-item-avatar class="ex-cell-top pt-1 mr-3">
      <ex-type-editor-menu
        v-bind="$props"
        @change="triggerChange"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="primary--text">
        <strong>Number</strong>
      </v-list-item-title>
      <v-list-item-subtitle 
        v-if="!disableSubSettings"
        v-html="summary"
      ></v-list-item-subtitle>
    <v-list-item-subtitle 
        v-if="description"
        class="grey--text"
        v-text="description"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { NumberType, NumberOptions, isNumber } from 'expangine-runtime';
import { SimpleFieldSettings, friendlyList } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<NumberOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'whole', type: 'boolean', label: 'Whole', defaultValue: false },
];

export default TypeEditorBase<NumberType, any>().extend({
  name: 'NumberEditor',
  computed: {
    optionFields: () => fields,
    description(): string {
      const { min, max, whole } = this.type.options;
      const things: string[] = [];

      if (isNumber(min) && isNumber(max)) {
        things.push('between ' + min + ' and ' + max);
      } else if (isNumber(min)) {
        things.push('at least ' + min);
      } else if (isNumber(max)) {
        things.push('less than ' + max);
      }
      if (whole) {
        things.push('must be a whole number');
      }

      return friendlyList(things);
    },
  },
});
</script>