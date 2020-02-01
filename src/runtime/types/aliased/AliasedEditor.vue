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
        <strong v-html="title"></strong>
      </v-list-item-title>
      <v-list-item-subtitle
        v-html="description"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { AliasedType, ObjectType } from 'expangine-runtime';
import { AliasedOptions } from './AliasedTypes';
import { friendlyList } from '@/common';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<AliasedType, AliasedOptions>().extend({
  name: 'AliasedEditor',
  computed: {
    title(): string {
      return this.type.options;
    },
    aliasedType(): ObjectType | null {
      return this.registry.defs.aliased[this.type.options] || null;
    },
    description(): string {
      return this.aliasedType
        ? friendlyList(Object.keys(this.aliasedType.options.props))
        : '';
    },
  },
});
</script>
