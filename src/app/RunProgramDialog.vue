<template>
  <v-dialog v-model="visible" max-width="1000">
    <v-card v-if="visible">
      <v-card-title class="headline">
        Execution Results
      </v-card-title>
      <v-card-text>
        <v-tabs>
          <v-tab>Output</v-tab>
          <v-tab>Output Raw</v-tab>
          <v-tab v-if="showData">Data After Execution</v-tab>
          <v-tab v-if="showData">Data Before Execution</v-tab>
          <v-tab v-if="showData">Data Changes</v-tab>
          <v-tab-item class="data-container">
            <pre class="data-box" v-html="resultString"></pre>
          </v-tab-item>
          <v-tab-item class="data-container">
            <pre class="data-box" v-html="rawString"></pre>
          </v-tab-item>
          <v-tab-item v-if="showData" class="data-container">
            <pre class="data-box" v-html="dataAfterString"></pre>
          </v-tab-item>
          <v-tab-item v-if="showData" class="data-container">
            <pre class="data-box" v-html="dataString"></pre>
          </v-tab-item>
          <v-tab-item v-if="showData" class="data-container">
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
import { Type, AnyType, TextType, ColorType, ColorSpaceRGB } from 'expangine-runtime';
import { runProgramDialog } from './RunProgram';
import { ListOptions, friendlyList, asArray } from '../common';
import { TypeVisuals } from '../runtime/types/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler, TypeBuilderWrapHandler, TypeBuilderWrapOption } from '../runtime/types/TypeBuilder';


const TAB = '  ';
const NEWLINE = '\n';
const PROCESS = (data: any, t: Type) => 
  t instanceof TextType
    ? '"' + data + '"'
    : t instanceof ColorType
      ? '<span class="color-square" style="background-color: ' + ColorSpaceRGB.formatMap.bestfit.formatter(data) + '"></span>' +  ColorSpaceRGB.formatMap.bestfit.formatter(data)
      : undefined;
const PROCESS_INVALID = (data: any) =>
  '<span class="invalid">' + JSON.stringify(data) + '</span>';


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
    resultType(): Type {
      const described = this.registry.defs.describe(this.result);
      if (described) {
        described.removeDescribedRestrictions();
      }
      return described || AnyType.baseType;
    },
    resultString(): string {
      return this.registry.getTypeToString(this.result, this.resultType, TAB, NEWLINE, '', PROCESS, PROCESS_INVALID);
    },
    rawString(): string {
      return JSON.stringify(this.resultType.toJson(this.result), undefined, 2);
    },
    dataString(): string {
      return this.registry.getTypeToString(this.data, this.type, TAB, NEWLINE, '', PROCESS, PROCESS_INVALID);
    },
    dataAfterString(): string {
      return this.registry.getTypeToString(this.dataAfter, this.type, TAB, NEWLINE, '', PROCESS, PROCESS_INVALID);
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
  
  /deep/ .invalid {
    color: #e02618;
    border-bottom: 1px solid #e02618;
  }

  /deep/ .color-square {
    display: inline-block;
    width: 11px;
    height: 11px;
    top: 2px;
    position: relative;
    margin-right: 3px;
    margin-top: -2px;
  }
}
</style>