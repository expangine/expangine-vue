<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        Edit Function
      </v-card-title>
      <v-card-text>
        <ex-edit-function
          :func="func"
          :registry="registry"
          @remove="close(false)"
        ></ex-edit-function>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          v-html="buttonText"
          @click="close(isSaved)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { NoExpression } from 'expangine-runtime';
import { editFunctionDialog, PREF_FULLSCREEN_EDIT_FUNCTION } from './EditFunction';
import { Preferences } from './Preference';



export default Vue.extend({
  data: () => editFunctionDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    disableSave(): boolean {
      return this.func.expression === NoExpression.instance;
    },
    isSaved(): boolean {
      return this.registry.defs.getFunction(this.func.name) === this.func;
    },
    buttonText(): string {
      return this.isSaved ? 'Close' : 'Cancel';
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_EDIT_FUNCTION, this.fullscreen);
    },
  },
});
</script>