<template>
  <v-list v-if="hasHooks">
    <template v-for="hook in hooks">
      <v-list-item :key="hook.text" @click="hook.value">
        <v-list-item-title
          v-html="hook.text"
        ></v-list-item-title>
        <v-list-item-subtitle
          v-html="hook.description"
        ></v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
import { ListOptions } from '../../common';
import { TypeSettings } from './TypeVisuals';
import { TypeHookHandler, TypeHookOption } from './TypeHook';
import { Registry } from '../Registry';


export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    parent: {
      type: Object as () => Type,
    },
    parentSettings: {
      type: Object as () => TypeSettings,
    },
    type: {
      type: Object as () => Type,
    },
    typeSettings: {
      type: Object as () => TypeSettings,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasHooks(): boolean {
      return this.hooks.length > 0;
    },
    hooks(): ListOptions<TypeHookHandler> {
      return this.registry.getTypeHooksFor(this);
    },
  },
});
</script>