<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
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
           v-focus-on-visible="[visible, 'input, textarea, select']"
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
import { getRunProgram, PREF_FULLSCREEN_RUN_PROGRAM } from './RunProgram';
import { Preferences } from './Preference';
import { Program } from 'expangine-runtime';


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

      Preferences.set(PREF_FULLSCREEN_RUN_PROGRAM, this.fullscreen);
    },
    test() {
      getRunProgram({
        registry: this.registry,
        program: Program.create(this.registry.defs, {
          dataType: this.params,
          datasets: [{ 
            name: '',
            data: this.data,
            created: 0,
            updated: 0,
            meta: null,
          }],
          expression: this.func.expression,
        }),
      });
    },
  },
});
</script>