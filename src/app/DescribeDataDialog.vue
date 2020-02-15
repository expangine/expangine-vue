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
        <v-tabs>
          <v-tab>Input</v-tab>
          <v-tab v-if="type">Type</v-tab>
          <v-tab v-if="type">Data</v-tab>
          <v-tab-item class="data-container">
            <v-textarea
              solo
              flat
              filled
              hide-details
              height="100%"
              placeholder="Paste your JS code or JSON here"
              v-focus-on-visible="[visible, 'textarea']"
              v-model="input"
            ></v-textarea>
          </v-tab-item>
          <v-tab-item class="data-container" v-if="type">
            <ex-type-editor
              :type="type"
              :registry="registry"
              :settings="settings"
              @change="onChange"
            ></ex-type-editor>
          </v-tab-item>
          <v-tab-item class="data-container" v-if="data">
            <ex-type-input
              v-model="data"
              :type="dataType"
              :registry="registry"
              :settings="settings"
            ></ex-type-input>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          @click="close(false)"
        >Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-checkbox
          hide-details
          class="mt-0 ma-2"
          v-model="removeDescribedRestrictions"
          label="Remove Detected Restrictions"
        ></v-checkbox>
        <v-btn 
          v-if="canDetect"
          color="primary"
          @click="determineType"
        >Detect</v-btn>
        <v-btn 
          v-if="canLoad"
          color="primary"
          @click="close(true)"
        >Load</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { diffLines } from 'diff';
import { Type, AnyType, TextType } from 'expangine-runtime';
import { describeDataDialog, PREF_FULLSCREEN_DESCRIBE_DATA } from './DescribeData';
import { ListOptions, friendlyList, asArray } from '../common';
import { TypeVisuals, TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler, TypeBuilderWrapHandler, TypeBuilderWrapOption } from '../runtime/types/TypeBuilder';
import { sendNotification } from './Notify';
import { LiveRuntime } from 'expangine-runtime-live';
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
    canDetect(): boolean {
      return !!this.input;
    },
    canLoad(): boolean {
      return !!(this.input && this.type);
    },
    dataType(): Type | null {
      if (!this.type || !this.removeDescribedRestrictions) {
        return this.type;
      }
      const removed = this.registry.defs.cloneType(this.type);
      removed.removeDescribedRestrictions();
      return removed;
    },
  }, 
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_DESCRIBE_DATA, this.fullscreen);
    },
    determineType() {
      const firstVarRegex = /(var\s+|const\s+|let\s+|)([$a-z_][$a-z_0-9]*)\s*=/gi;
      const firstVarMatch = firstVarRegex.exec(this.input);
      let result;
      let error;

      if (firstVarMatch) {
        const firstVar = firstVarMatch[2];

        try {
          result = new Function(this.input + ' return ' + firstVar)();
        } catch (e) {
          error = e;
        }
      } else {
        try {
          result = new Function('return ' + this.input)();
        } catch (e) {
          error = e;
        }
      }

      if (result !== undefined) {
        this.data = result;
        this.type = this.registry.defs.describe(this.data);
        this.settings = this.registry.getTypeSettings(this.type);
      } else if (error) {
        sendNotification({ message: error });
      } else {
        sendNotification({ message: 'There was an unexpected problem detecting data.' });
      }
    },
    onChange(event: TypeUpdateEvent) {
      this.type = event.type;
      this.settings = event.settings;
      
      if (event.transform) {
        const command = LiveRuntime.getCommand(event.transform);
        this.data = command({ value: this.data });
      }
    },
  },
});
</script>

<style lang="less" scoped>
.data-container {
  position: relative;
  height: calc(100vh - 300px);
  overflow: scroll;
}

.v-textarea {
  height: 100%;

  /deep/ .v-input__control {
    height: 100%;

    .v-text-field__slot {
      overflow: hidden;

      textarea {
        height: 100%;
      }
    }
  }
}
</style>