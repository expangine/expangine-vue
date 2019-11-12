<template>
  <v-menu max-height="400">
    <template #activator="ma">
      <v-tooltip top open-delay="1000">
        <template #activator="ta">
          <v-chip 
            :color="color" 
            :dark="dark"
            v-on="{ ...ta.on, ...ma.on }"
            v-html="text"
          ></v-chip>
        </template>
        <span v-html="tooltip"></span>
      </v-tooltip>
    </template>
    <slot></slot>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
  name: 'ex-chip-menu',
  props: {
    text: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
});
</script>