<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        Describe Data
      </v-card-title>
      <v-card-text>
        <ex-describe-data
          :registry="registry"
          @load="close"
        ></ex-describe-data>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          @click="close(false)"
        >Cancel</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { describeDataDialog, PREF_FULLSCREEN_DESCRIBE_DATA } from './DescribeData';
import { Preferences } from './Preference';


export default Vue.extend({
  data: () => describeDataDialog,
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

      Preferences.set(PREF_FULLSCREEN_DESCRIBE_DATA, this.fullscreen);
    },
    
  },
});
</script>
