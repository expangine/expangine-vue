<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        {{ title }}

        <v-switch
          hide-details
          class="mt-0 ml-4"
          label="Read Only"
          v-model="readOnly"
        ></v-switch>

        <v-btn 
          right
          absolute
          color="secondary"
          @click="test"
        >Test</v-btn>
      </v-card-title>
      <v-card-text>
        <p v-if="message" v-html="message"></p>
        <v-tabs v-if="hasTabs">
          <v-tab>{{ programLabel }}</v-tab>
          <v-tab>Return Type</v-tab>
          <v-tab-item>
            <ex-expression
              v-model="program"
              :context="context"
              :registry="registry"
              :required-type="expectedType"
              :read-only="readOnly"
            ></ex-expression>
          </v-tab-item>
          <v-tab-item>
            <ex-type-string-box
              class="ma-1 ex-scrollable"
              :type="actualType"
              :registry="registry"
            ></ex-type-string-box>
          </v-tab-item>
        </v-tabs>
        <ex-expression
          v-else
          v-model="program"
          :context="context"
          :registry="registry"
          :required-type="expectedType"
          :read-only="readOnly"
        ></ex-expression>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="secondary"
          @click="cancel"
        >{{ unconfirm }}</v-btn>
        <v-spacer></v-spacer>
        <v-alert 
          v-if="isInvalid"
          dense
          type="error"
          class="mb-0 mr-3"
        >Your expression does not return correct type.</v-alert>
        <v-btn 
          color="primary"
          @click="ok"
          :disabled="isDisabled"
          v-focus-on-visible="[visible, 'self']"
        >{{ confirm }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
import { getProgramDialog } from './GetProgram';
import { getTestProgram } from './TestProgram';


export default Vue.extend({
  data: () => getProgramDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    hasTabs(): boolean {
      return !this.expectedType;
    },
    actualType(): Type | null {
      return this.program.getType(this.registry.defs, this.context);
    },
    actualTypeDescribed(): string {
      return this.actualType
        ? this.registry.getTypeDescribeLong(this.actualType, '&nbsp;&nbsp;', '<br>')
        : '';
    },
    isDisabled(): boolean {
      return !this.actualType;
    },
    isInvalid(): boolean {
      const { actualType, expectedType } = this;

      return !!(expectedType && (!actualType || !expectedType.acceptsType(actualType)));
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    cancel() {
      this.close(false);
    },
    ok() {
      this.close(true);
    },
    async test() {
      const { registry, program, context: inputType } = this;

      await getTestProgram({
        registry, 
        program,
        inputType,
      });
    },
  },
});
</script>