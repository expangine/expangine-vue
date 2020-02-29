<template>
  <div>
    <v-tabs>
      <v-tab>Output</v-tab>
      <v-tab>Output (json)</v-tab>
      <v-tab v-if="showData">Data After Execution</v-tab>
      <v-tab v-if="showData">Data Before Execution</v-tab>
      <v-tab v-if="showData">Data Changes</v-tab>
      <v-chip label class="float-right ma-2">
        Elapsed: {{ elapsedTime }}
      </v-chip>

      <v-tab-item>
        <ex-data-string-box
          quotes              
          :registry="registry"
          :data="result"
          :type="resultType"
        ></ex-data-string-box>
      </v-tab-item>
      <v-tab-item>
        <div class="ex-code-container">
          <pre class="ex-code" v-html="rawString"></pre>
        </div>
      </v-tab-item>
      <v-tab-item v-if="showData">
        <ex-data-string-box
          quotes
          :registry="registry"
          :data="dataAfter"
          :type="type"
          @string="dataAfterString = $event"
          ></ex-data-string-box>
      </v-tab-item>
      <v-tab-item v-if="showData">
        <ex-data-string-box
          quotes
          :registry="registry"
          :data="data"
          :type="type"
          @string="dataString = $event"
          ></ex-data-string-box>
      </v-tab-item>
      <v-tab-item v-if="showData">
        <div class="ex-code-container">
          <pre class="ex-code" v-html="diffString"></pre>
        </div>
      </v-tab-item>
    </v-tabs>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { diffLines } from 'diff';
import { Type, AnyType, TextType, ColorType, ColorSpaceRGB, Program } from 'expangine-runtime';
import { ListOptions, friendlyList, asArray } from '../common';
import { TypeVisuals } from '../runtime/types/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler, TypeBuilderWrapHandler, TypeBuilderWrapOption } from '../runtime/types/TypeBuilder';
import { runProgramDialog, PREF_FULLSCREEN_RUN_PROGRAM } from './RunProgram';
import { Preferences } from './Preference';
import { Registry } from '../runtime/Registry';
import { LiveRuntime } from 'expangine-runtime-live';
import { measure } from './StopWatch';


interface Part { value: string; added: boolean; removed: boolean; }
const getColor = (part: Part): string => part.added ? 'added' : part.removed ? 'removed' : '';

export default Vue.extend({
  props: {
    program: {
      type: Object as () => Program,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  data: () => ({
    dataString: '',
    dataAfter: null,
    dataAfterString: '',
    result: null,
    elapsedTime: '',
  }),
  computed: {
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
  watch: {
    program: {
      immediate: true,
      handler(program: Program) {
        const { dataType: type, datasets, expression } = program;
        const data = type.fromJson(type.toJson(datasets[0].data));
        const { elapsedSummary, result } = measure(() => LiveRuntime.run(expression, data));

        this.elapsedTime = elapsedSummary;
        this.dataAfter = data;
        this.result = result;
      },
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