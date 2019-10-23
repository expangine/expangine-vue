<template>
  <v-list-item>
    <v-list-item-avatar class="cell-top pt-1 mr-3">
      <ex-type-editor-menu
        v-bind="$props"
        @change="triggerChange"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="primary--text">
        <strong>Enum</strong>
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
import { EnumType, toArray } from 'expangine-runtime';
import { EnumSubs } from './EnumTypes';
import { friendlyList } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<EnumType, any, EnumSubs>().extend({
  name: 'EnumEditor',
  computed: {
    description(): string {
      return friendlyList(toArray(this.type.options.constants.keys()));
    },
  },
});
</script>