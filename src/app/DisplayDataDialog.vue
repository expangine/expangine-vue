<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        {{ title }}
      </v-card-title>
      <v-card-text>
        <v-tabs>
          <v-tab>Data</v-tab>
          <v-tab>Data (json)</v-tab>
          <v-tab-item>
            <ex-data-string-box
              max-height="calc(100vh - 300px)"
              quotes              
              :registry="registry"
              :data="data"
              :type="dataType"
            ></ex-data-string-box>
          </v-tab-item>
          <v-tab-item>
            <div class="ex-code-container" style="max-height: calc(100vh - 300px)">
              <pre class="ex-code" v-html="rawString"></pre>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary"
          @click="close"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, AnyType } from 'expangine-runtime';
import { displayDataDialog, PREF_FULLSCREEN_DISPLAY_DATA } from './DisplayData';
import { Preferences } from './Preference';


export default Vue.extend({
  data: () => displayDataDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    dataType(): Type {
      const described = this.registry.defs.describe(this.data);
      if (described) {
        described.removeDescribedRestrictions();
      }
      return described || AnyType.baseType;
    },
    rawString(): string {
      return JSON.stringify(this.dataType.toJson(this.data), undefined, 2);
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_DISPLAY_DATA, this.fullscreen);
    },
  },
});
</script>