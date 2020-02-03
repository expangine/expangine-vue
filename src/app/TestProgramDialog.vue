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
        <p v-html="description"></p>

        <ex-type-input
          :registry="registry"
          :type="inputType"
          :settings="inputSettings"
          :value="input"
          @input="setInput"
        ></ex-type-input>

        <div class="ex-center-aligned mt-3 px-3">
          <h4>Results</h4>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!resultAutomatic"
            icon
            class="mr-3"
            color="secondary"
            @click="updateResult(true)"
          ><v-icon>mdi-sync</v-icon></v-btn>
          <v-checkbox
            hide-details
            class="mt-0"
            label="Auto Update"
            v-model="resultAutomatic"
            @change="updateResult"
          ></v-checkbox>
        </div>
        <ex-data-string-box
          class="ma-3 mt-6"
          max-height="300px"
          quotes
          :registry="registry"
          :data="result"
        ></ex-data-string-box>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary"
          @click="close">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TypeMap, Expression, OperationExpression, ObjectType, ExpressionMap, NoExpression, ConstantExpression } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { OperationVisuals } from '../runtime/ops/OperationVisuals';
import { TypeSettings } from '../runtime/types/TypeVisuals';
import { testProgramDialog } from './TestProgram';


export default Vue.extend({
  data: () => testProgramDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    inputSettings(): TypeSettings {
      return this.registry.getTypeSettings(this.inputType);
    },
  },
  watch: {
    program() {
      this.updateResult();
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    setInput(input: any) {
      this.input = input;
      this.updateResult();
    },
    updateResult(forceUpdate: boolean = false) {
      if (!this.resultAutomatic && !forceUpdate) {
        return;
      }

      try {
        this.invalid = false;

        const cmd = LiveRuntime.getCommand(this.program);

        this.result = cmd(this.input);
      } catch (e) {
        this.invalid = true;
      }
    },
  },
});
</script>