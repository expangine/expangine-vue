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
import { Entity, EntityType, ObjectType } from 'expangine-runtime';
import { EntityOptions } from './EntityTypes';
import { friendlyList } from '@/common';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<EntityType, EntityOptions>().extend({
  name: 'EntityEditor',
  computed: {
    title(): string {
      return this.type.options;
    },
    entity(): Entity | null {
      return this.registry.defs.getEntity(this.type.options);
    },
    entityType(): ObjectType | null {
      return this.entity ? this.entity.type : null;
    },
    description(): string {
      return this.entityType
        ? friendlyList(Object.keys(this.entityType.options.props))
        : '';
    },
  },
});
</script>
