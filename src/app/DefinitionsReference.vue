<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-html="source"></v-list-item-title>
      <v-list-item-subtitle v-html="path"></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, DefinitionsEntityReference, DefinitionsDataReference, DefinitionsFunctionReference, DefinitionsRelationReference, Expression } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { getSourceName, getTypePath, getExpressionPath, getIcon } from './DefinitionsVisuals';


export default Vue.extend({
  props: {
    reference: {
      type: Object as () => DefinitionsEntityReference | DefinitionsDataReference | DefinitionsFunctionReference | DefinitionsRelationReference,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  computed: {
    icon(): string {
      return getIcon(this.reference.source);
    },  
    source(): string {
      return getSourceName(this.reference.source).replace(/\[/g, '<b>').replace(/\]/g, '</b>');
    },
    path(): string {
      return this.reference.value instanceof Type
        ? getTypePath(this.registry, this.reference.value, this.reference.root as Type).join(' > ')
        : getExpressionPath(this.registry, this.reference.value, this.reference.root as Expression).join(' > ');
    },
  },
});
</script>