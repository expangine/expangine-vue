<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        {{ title }}
      </v-card-title>
      <v-card-text>
        <ex-edit-entity
          :registry="registry"
          :entity="entity"
          @remove="removed"
        ></ex-edit-entity>
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
import { editEntityDialog, PREF_FULLSCREEN_EDIT_ALIASED } from './EditEntity';
import { Preferences } from './Preference';


export default Vue.extend({
  data: () => editEntityDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    title(): string {
      return this.name ? 'Edit Entity' : 'Add Entity';
    },
    isSaved(): boolean {
      return this.registry.defs.getEntity(this.entity.name) === this.entity;
    },
    buttonText(): string {
      return this.isSaved ? this.confirm : this.unconfirm;
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_EDIT_ALIASED, this.fullscreen);
    },
    finish() {
      this.done(this.isSaved);
    },
    removed() {
      this.done(false);
    },
  },
});
</script>