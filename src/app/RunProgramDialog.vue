<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        Execution Results
      </v-card-title>
      <v-card-text>
        <v-tabs>
          <v-tab>Output</v-tab>
          <v-tab>Output (json)</v-tab>
          <v-tab v-if="showData">Data After Execution</v-tab>
          <v-tab v-if="showData">Data Before Execution</v-tab>
          <v-tab v-if="showData">Data Changes</v-tab>
          <v-tab-item>
            <ex-data-string-box
              max-height="calc(100vh - 300px)"
              quotes              
              :registry="registry"
              :data="result"
              :type="resultType"
            ></ex-data-string-box>
          </v-tab-item>
          <v-tab-item>
            <div class="ex-code-container" style="max-height: calc(100vh - 300px)">
              <pre class="ex-code" v-html="rawString"></pre>
            </div>
          </v-tab-item>
          <v-tab-item v-if="showData">
            <ex-data-string-box
              max-height="calc(100vh - 300px)"
              quotes
              :registry="registry"
              :data="dataAfter"
              :type="type"
              @string="dataAfterString = $event"
             ></ex-data-string-box>
          </v-tab-item>
          <v-tab-item v-if="showData">
            <ex-data-string-box
              max-height="calc(100vh - 300px)"
              quotes
              :registry="registry"
              :data="data"
              :type="type"
              @string="dataString = $event"
             ></ex-data-string-box>
          </v-tab-item>
          <v-tab-item v-if="showData">
            <div class="ex-code-container" style="max-height: calc(100vh - 300px)">
              <pre class="ex-code" v-html="diffString"></pre>
            </div>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-chip label>
          Elapsed: {{ elapsedTime }}
        </v-chip>
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
import { diffLines } from 'diff';
import { Type, AnyType, TextType, ColorType, ColorSpaceRGB } from 'expangine-runtime';
import { runProgramDialog } from './RunProgram';
import { ListOptions, friendlyList, asArray } from '../common';
import { TypeVisuals } from '../runtime/types/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler, TypeBuilderWrapHandler, TypeBuilderWrapOption } from '../runtime/types/TypeBuilder';


interface Part { value: string; added: boolean; removed: boolean; }
const getColor = (part: Part): string => part.added ? 'added' : part.removed ? 'removed' : '';
const getText = (part: Part): string => part.value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export default Vue.extend({
  data: () => runProgramDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    resultType(): Type {
      const described = this.registry.defs.describe(this.result);
      if (described) {
        described.removeDescribedRestrictions();
      }
      return described || AnyType.baseType;
    },
    rawString(): string {
      return JSON.stringify(this.resultType.toJson(this.result), undefined, 2);
    },
    showData(): boolean {
      return this.dataString !== this.dataAfterString;
    },
    diffString(): string {
      return diffLines(this.dataString, this.dataAfterString)
        .map((part: Part) => `<span class="${getColor(part)}">${part.value}</span>`)
        .join('')
      ;
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
  },
});
</script>

<style lang="less" scoped>
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
</style>