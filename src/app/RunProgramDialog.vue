<template>
  <v-dialog v-model="visible" max-width="1000">
    <v-card v-if="visible">
      <v-card-title class="headline">
        Execution Results
      </v-card-title>
      <v-card-text>
        <v-tabs>
          <v-tab>Output</v-tab>
          <v-tab>Data After Execution</v-tab>
          <v-tab>Data Before Execution</v-tab>
          <v-tab>Data Changes</v-tab>
          <v-tab-item class="data-container">
            <pre class="data-box" v-html="resultString"></pre>
          </v-tab-item>
          <v-tab-item class="data-container">
            <pre class="data-box" v-html="dataAfterString"></pre>
          </v-tab-item>
          <v-tab-item class="data-container">
            <pre class="data-box" v-html="dataString"></pre>
          </v-tab-item>
          <v-tab-item class="data-container">
            <pre class="data-box" v-html="diffString"></pre>
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
import { diffLines } from 'diff';
import { Type, AnyType, TextType } from 'expangine-runtime';
import { runProgramDialog } from './RunProgram';
import { ListOptions, friendlyList, asArray } from '../common';
import { TypeVisuals } from '../runtime/types/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler, TypeBuilderWrapHandler, TypeBuilderWrapOption } from '../runtime/types/TypeBuilder';


const TAB = '  ';
const NEWLINE = '\n';

interface Part { value: string; added: boolean; removed: boolean; }
const getColor = (part: Part): string => part.added ? 'added' : part.removed ? 'removed' : '';
const getText = (part: Part): string => part.value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');
const getProcess = (data: any, type: Type) => 
  type instanceof TextType
    ? '"' + data + '"'
    : data;

export default Vue.extend({
  data: () => runProgramDialog,
  computed: {
    resultType(): Type {
      const described = this.registry.defs.describe(this.result);
      if (described) {
        described.removeDescribedRestrictions();
      }
      return described || AnyType.baseType;
    },
    resultString(): string {
      return this.registry.getTypeToString(this.result, this.resultType, TAB, NEWLINE, '', getProcess);
    },
    dataString(): string {
      return this.registry.getTypeToString(this.data, this.type, TAB, NEWLINE, '', getProcess);
    },
    dataAfterString(): string {
      return this.registry.getTypeToString(this.dataAfter, this.type, TAB, NEWLINE, '', getProcess);
    },
    diffString(): string {
      return diffLines(this.dataString, this.dataAfterString)
        .map((part: Part) => `<span class="${getColor(part)}">${getText(part)}</span>`)
        .join('')
      ;
    },
  },
});
</script>

<style lang="less" scoped>
.data-container {
  position: relative;
  height: calc(100vh - 300px);
}

.data-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: scroll;
  padding: 10px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  font-weight: normal;
  color: black;
  border: 1px solid rgba(0,0,0,0.2);
  line-height: 1em;
  font-weight: bold;

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