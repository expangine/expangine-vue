<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        Unit Test for {{ func.name }}

        <v-spacer></v-spacer>
        <v-btn icon @click="close(isSaved)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <ex-namer
          auto-validate
          :validate="validateName"
          :value="test.name"
          @input="renamed"
          @remove="remove"
        ></ex-namer>

        <v-textarea
          outlined
          rows="3"
          label="Description"
          class="mt-3"
          v-model="test.description"
        ></v-textarea>

        <h5>Test Input</h5>

        <ex-type-input
          :type="func.params"
          :registry="registry"
          :settings="settings"
          v-model="test.args"
        ></ex-type-input>

        <h5>Actual Output</h5>

        <ex-data-string-box
          class="ma-3"
          max-height="300px"
          :registry="registry"
          :data="actual"
          @string="actualString = $event"
        ></ex-data-string-box>

        <h5>Expected Output</h5>

        <ex-data-string-box
          class="ma-3"
          max-height="300px"
          :registry="registry"
          :data="expected"
          @string="expectedString = $event"
        ></ex-data-string-box>

        <template v-if="showDiff">
          <h5>Difference</h5>
          <div class="ex-code-container ma-3">
            <pre class="ex-code" v-html="diffString"></pre>
          </div>
        </template>
        
      </v-card-text>
      <v-card-actions>
        <v-btn @click="updateExpected" :disabled="passes">
          Update Expected Output to Actual Output
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">
          {{ buttonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { diffWords, Part } from 'diff';
import { DataTypes } from 'expangine-runtime';
import { TypeSettings } from '../runtime/types/TypeVisuals';
import { Preferences } from './Preference';
import { funcTestDialog, PREF_FULLSCREEN_FUNC_TEST } from './FuncTest';
import { LiveRuntime } from 'expangine-runtime-live';


const getColor = (part: Part): string => part.added ? 'added' : part.removed ? 'removed' : '';

export default Vue.extend({
  data: () => funcTestDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    index(): number {
      return this.func.tests.indexOf(this.test);
    },
    isSaved(): boolean {
      return this.index !== -1;
    },
    buttonText(): string {
      return this.isSaved ? 'Close' : 'Cancel';
    },
    settings(): TypeSettings {
      return this.registry.getTypeSettingsValidFor(this.func.params, this.func.meta)
        ? this.func.meta
        : this.registry.getTypeSettings(this.func.params);
    },
    actual(): any {
      const actual = LiveRuntime.run(this.func.expression, DataTypes.copy(this.test.args));

      return actual === undefined ? null : actual;
    },
    expected(): any {
      return this.test.expected === undefined ? null : this.test.expected;
    },
    passes(): boolean {
      return DataTypes.equals(this.actual, this.test.expected);
    },
    showDiff(): boolean {
      return !this.passes;
    },
    diffString(): string {
      return diffWords(this.expectedString || '', this.actualString || '')
        .map((part: Part) => `<span class="${getColor(part)}">${part.value}</span>`)
        .join('')
      ;
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;

      Preferences.set(PREF_FULLSCREEN_FUNC_TEST, this.fullscreen);
    },
    renamed(name: string) {
      this.test.name = name;

      if (this.index === -1) {
        this.func.tests.push(this.test);
      }
    },
    remove() {
      if (this.isSaved) {
        this.func.tests.splice(this.index, 1);
      }
      
      this.close(false);
    },
    validateName(name: string) {
      return !name
        ? 'A test name is required'
        : this.func.tests.some((t) => t.name === name && t !== this.test)
          ? 'A test for this function already exists with this name'
          : '';
    },
    updateExpected() {
      this.test.expected = DataTypes.copy(this.actual);
    },
  },
});
</script>

<style lang="less" scoped>
.ex-code-container {
  max-height: 300px;
  overflow: scroll;

  .ex-code {
    /deep/ .removed {
      color: #e02618;
      background-color: #ffebeb;
    }

    /deep/ .added {
      color: #02a024;
      background-color: #daf7da;
    }
  }
}
</style>