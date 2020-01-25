<template>
  <v-dialog v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        {{ title }}
        <v-chip 
          v-if="name" 
          label 
          class="ml-3"
        >{{ name }}</v-chip>
      </v-card-title>
      <v-card-text>
        <ex-type-input
          :registry="registry"
          :value="data"
          :type="params"
          :settings="settings"
        ></ex-type-input>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          @click="close">
          Done
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary"
          @click="test">
          <v-icon>mdi-play</v-icon>
          Test
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { testFunctionDialog } from './TestFunction';
import { getRunProgram } from './RunProgram';


export default Vue.extend({
  data: () => testFunctionDialog,
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
    test() {
      getRunProgram({
        registry: this.registry,
        type: this.params,
        program: this.func.options.expression,
        data: this.data,
      });
    },
  },
});
</script>