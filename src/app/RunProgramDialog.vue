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
          <v-tab-item class="expanded-code">
            <code class="d-block pa-2 ma-2" 
              v-html="resultString"
            ></code>
          </v-tab-item>
          <v-tab-item class="expanded-code">
            <code class="d-block pa-2 ma-2" 
              v-html="dataAfterString"
            ></code>
          </v-tab-item>
          <v-tab-item class="expanded-code">
            <code class="d-block pa-2 ma-2" 
              v-html="dataString"
            ></code>
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
import { Type, AnyType } from 'expangine-runtime';
import { runProgramDialog } from './RunProgram';
import { ListOptions, friendlyList, asArray } from '../common';
import { TypeVisuals } from '../runtime/types/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler, TypeBuilderWrapHandler, TypeBuilderWrapOption } from '../runtime/types/TypeBuilder';


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
      return this.registry.getTypeToString(this.result, this.resultType, '&nbsp;&nbsp;', '<br>');
    },
    dataString(): string {
      return this.registry.getTypeToString(this.data, this.type, '&nbsp;&nbsp;', '<br>');
    },
    dataAfterString(): string {
      return this.registry.getTypeToString(this.dataAfter, this.type, '&nbsp;&nbsp;', '<br>');
    },
  },
});
</script>

<style lang="less" scoped>
.expanded-code {
  position: relative;
  height: calc(100vh - 300px);

  code {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: scroll;
  }
}
</style>