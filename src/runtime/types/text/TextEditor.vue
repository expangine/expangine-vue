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
        :hide-settings="hideSettings"
        @change="triggerChange"
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


export default TypeEditorBase<TextType, any>().extend({
  name: 'TextEditor',
  computed: {
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