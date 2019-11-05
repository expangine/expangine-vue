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
        <strong>Color</strong>
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
import { ColorType } from 'expangine-runtime';
import { friendlyList } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<ColorType, any>().extend({
  name: 'ColorEditor',
  computed: {
    description(): string {
      return this.type.options.hasAlpha
        ? 'Red, Green, Blue, and Alpha'
        : 'Red, Green, and Blue';
    },
  },
});
</script>