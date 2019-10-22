<template>
  <v-dialog v-model="visible" fullscreen scrollable>
    <v-card v-if="visible">
      <v-card-title class="pa-0">
        <v-toolbar dark class="elevation-0">

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="first">
                <v-icon>mdi-skip-backward</v-icon>
              </v-btn>
            </template>
            <span>Restart Debugging</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="stepBack">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Back</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="stepInto">
                <v-icon>mdi-debug-step-into</v-icon>
              </v-btn>
            </template>
            <span>Step Into (Forward)</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="stepOver">
                <v-icon>mdi-debug-step-over</v-icon>
              </v-btn>
            </template>
            <span>Step Over</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="stepOut">
                <v-icon>mdi-debug-step-out</v-icon>
              </v-btn>
            </template>
            <span>Step Out</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="last">
                <v-icon>mdi-skip-forward</v-icon>
              </v-btn>
            </template>
            <span>End Debugging</span>
          </v-tooltip>

          <v-spacer></v-spacer>

          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>

        </v-toolbar>

      </v-card-title>
      <v-card-text class="pa-0">
        <v-container fluid fill-height>
          <v-row>

            <v-col cols="9">

              <ex-expression
                type="body"
                :value="step.program"
                :context="type"
                :registry="registry"
                :highlight="step.expr"
              ></ex-expression>
              
            </v-col>

            <v-col cols="3">

              <v-expansion-panels accordion focusable multiple>
                <v-expansion-panel>
                  <v-expansion-panel-header>Callstack</v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-0">
                    <v-list dense>
                      <template v-for="(call, callIndex) in callstack">
                        <debug-stack 
                          :key="callIndex"
                          :registry="registry"
                          :step="call"
                          :index="callIndex"
                        ></debug-stack>
                      </template>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Inspect</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <template v-for="(node, nodeIndex) in scopeNodes">
                      <debug-node
                        :key="nodeIndex"
                        :registry="registry"
                        :node="node"
                      ></debug-node>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, TextType } from 'expangine-runtime';
import { debugProgramDialog, DebugStep } from './DebugProgram';
import { TypeSubNode } from '../runtime/types/TypeVisuals';
import DebugStack from './DebugStack.vue';
import DebugNode from './DebugNode.vue';


export default Vue.extend({
  components: {
    DebugStack,
    DebugNode,
  },
  data: () => debugProgramDialog,
  computed: {
    step(): DebugStep {
      return this.steps[this.currentStep];
    },
    callstack(): DebugStep[] {
      const stack: DebugStep[] = [];
      const { step, steps } = this;
      let currentStep = this.currentStep;

      let depth = step.depth;
      while (currentStep >= 0) { 
        const current = steps[currentStep];
        if (current.depth === depth) {
          stack.push(current);
          depth--;
        }
        currentStep--;
      }
      
      return stack;
    },
    scopeNodes(): TypeSubNode[] {
      const nodes: TypeSubNode[] = [];

      if (this.step.resultType) {
        nodes.push({
          sub: 'Result',
          subType: TextType.baseType,
          value: this.step.result,
          valueType: this.step.resultType,
        });
      }

      nodes.push({
        sub: 'Context',
        subType: TextType.baseType,
        value: this.step.context,
        valueType: this.step.contextType,
      });

      return nodes;
    },
  },
  methods: {
    first() {
      this.currentStep = 0;
    },
    last() {
      this.currentStep = this.steps.length - 1;
    },
    back() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    forward() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    },
    stepBack() {
      const curr = this.step;
      this.back();
      if (this.step.expr === curr.expr) {
        this.back();
      }
    },
    stepInto() {
      const curr = this.step;
      this.forward();
      if (this.step.expr === curr.expr) {
        this.forward();
      }
    },
    stepOver() {
      if (this.step.type === 'exit') {
        this.forward();
      } else {
        this.forwardToDepth(this.step.depth);
      }
    },
    stepOut() {
      if (this.step.type === 'exit') {
        this.forward();
      } else {
        this.forwardToDepth(this.step.depth - 1);
      }
    },
    forwardToDepth(depth: number) {
      const steps = this.steps;
      const stop = steps.length - 1;
      let index = this.currentStep + 1;
      while (index < stop && steps[index].depth !== depth) {
        index++;
      }

      this.currentStep = index;
    },
  },
});
</script>

<style lang="less" scoped>
/deep/ .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>