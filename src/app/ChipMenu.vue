<template>
  <v-menu max-height="400" ref="menu">
    <template #activator="ma">
      <v-tooltip top open-delay="1000">
        <template #activator="ta">
          <v-chip 
            :color="color" 
            :dark="dark"
            :class="chipClass"
            tabindex="0"
            v-on="{ ...ta.on, ...ma.on }"
            v-html="text"
            @keydown.enter="openMenu"
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
  name: 'ChipMenu',
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
    chipClass: {
      type: String,
      default: '',
    },
  },
  methods: {
    openMenu() {
      const menu = this.$refs.menu as any;

      if (menu) {
        menu.isActive = true;
      }
    },
  },
});
</script>