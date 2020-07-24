<template>
  <v-dialog persistent v-model="visible" max-width="600" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        {{ title }}
      </v-card-title>
      <v-card-text>
        <ex-edit-entity-transcoder
          :property="property"
          :transcoder="transcoder"
          :entity="entity"
          :registry="registry"
        ></ex-edit-entity-transcoder>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="buttonText" 
          @click="finish"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { editTypeTranscoderDialog, PREF_FULLSCREEN_EDIT_TRANSCODER } from './EditEntityTranscoder';
import { Preferences } from './Preference';


export default Vue.extend({
  data: () => editTypeTranscoderDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    title(): string {
      return `Transcoder for "${this.property}"`;
    },
    isSaved(): boolean {
      return this.entity.transcoders[this.property] === this.transcoder;
    },
    buttonText(): string {
      return this.isSaved ? this.confirm : this.unconfirm;
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_EDIT_TRANSCODER, this.fullscreen);
    },
    finish() {
      this.handle(this.isSaved);
    },
  },
});
</script>