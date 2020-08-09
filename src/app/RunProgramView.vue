<template>
  <div>
    <v-tabs class="ex-accent-bar" v-model="tab">
      <v-tab>Output</v-tab>
      <v-tab>JSON</v-tab>
      <v-tab>UI</v-tab>
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
      <v-tab-item>
        <ex-type-input
          v-if="isOutputInterface"
          read-only
          :value="result"
          :type="resultType"
          :registry="registry"
          :settings="resultSettings"
        ></ex-type-input>
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
import { Type, AnyType, Program } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { LiveRuntime } from 'expangine-runtime-live';
import { measure } from './StopWatch';
import { TypeSettings } from '../runtime/types/TypeVisuals';


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
    tab: null,
  }),
  computed: {
    resultType(): Type {
      const described = this.registry.defs.describe(this.result);
      if (described) {
        described.removeDescribedRestrictions();
      }
      return described || AnyType.baseType;
    },
    resultSettings(): TypeSettings {
      return this.registry.getTypeSettings(this.resultType);
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
    isOutputInterface(): boolean {
      return this.tab === 2;
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