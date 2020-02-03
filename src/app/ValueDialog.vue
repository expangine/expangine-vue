<template>
  <v-dialog persistent v-model="visible" max-width="300" :fullscreen="isFullscreen">
    <v-card>
      <v-card-title class="headline">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        <span v-html="title"></span>
      </v-card-title>
      <v-card-text 
        v-html="message"
      ></v-card-text>
      <v-card-text v-focus-on-visible="[visible, 'input, textarea, select']">
        <ex-type-input
          :type="type"
          :registry="registry"
          :settings="settings"
          v-model="value"
        ></ex-type-input>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          v-html="confirm" 
          @click="handle(true)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="unconfirm" 
          @click="handle(false)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { valueDialog } from './Value';


export default Vue.extend({
  data: () => valueDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
  },
});
</script>