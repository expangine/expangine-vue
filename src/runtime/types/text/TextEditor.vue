<template>
  <v-list-item>
    <v-list-item-avatar class="cell-top pt-1 mr-3">
      <ex-type-editor-menu
        :type="type"
        :settings="settings"
        :registry="registry"
        :parent="parent"
        :read-only="readOnly"
        :disable-sub-settings="disableSubSettings"
        @input:type="updateType"
        @input:settings="updateSettings"
        @change:type="changeType"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="primary--text">
        <strong>Text</strong>
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
import { TextType, TextOptions, isNumber } from 'expangine-runtime';
import { SimpleFieldSettings, friendlyList } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<TextOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'requireUpper', type: 'boolean', label: 'Require Upper'},
  { name: 'requireLower', type: 'boolean', label: 'Require Lower'},
  { name: 'forceUpper', type: 'boolean', label: 'Force Upper'},
  { name: 'forceLower', type: 'boolean', label: 'Force Lower'},
];

export default TypeEditorBase<TextType, any>().extend({
  name: 'TextEditor',
  computed: {
    optionFields: () => fields,
    description(): string {
      const { min, max, requireUpper, requireLower, forceUpper, forceLower } = this.type.options;
      const things: string[] = [];

      if (isNumber(min) && isNumber(max)) {
        things.push('between ' + min + ' and ' + max + ' characters');
      } else if (isNumber(min)) {
        things.push('at least ' + min + ' characters');
      } else if (isNumber(max)) {
        things.push('no more than ' + max + ' characters');
      }
      if (requireUpper) {
        things.push('must be uppercase');
      }
      if (requireLower) {
        things.push('must be lowercase');
      }
      if (forceUpper) {
        things.push('forced to uppercase');
      }
      if (forceLower) {
        things.push('forced to lowercase');
      }

      return friendlyList(things);
    },
  },
});
</script>

<style lang="sass" scoped>

</style>
