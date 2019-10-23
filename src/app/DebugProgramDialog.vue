<template>
  <v-dialog v-model="visible" fullscreen scrollable>
    <v-card v-if="visible">
      <v-card-title class="pa-0">
        <v-toolbar dark class="elevation-0">

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledBack" v-on="on" @click="first">
                <v-icon>mdi-skip-backward</v-icon>
              </v-btn>
            </template>
            <span>Restart Debugging</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledBack" v-on="on" @click="stepBack">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Back</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="stepInto">
                <v-icon>mdi-debug-step-into</v-icon>
              </v-btn>
            </template>
            <span>Step Into (Forward)</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="stepOver">
                <v-icon>mdi-debug-step-over</v-icon>
              </v-btn>
            </template>
            <span>Step Over</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="stepOut">
                <v-icon>mdi-debug-step-out</v-icon>
              </v-btn>
            </template>
            <span>Step Out</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="last">
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
                :highlight="highlightMap"
              ></ex-expression>
              
            </v-col>

            <v-col cols="3">

              <v-expansion-panels accordion focusable multiple>

                <v-expansion-panel>
                  <v-expansion-panel-header>Callstack</v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-0">
                    <v-list dense>
                      <template v-for="(call, callIndex) in callstack">
                        <ex-debug-stack 
                          :key="callIndex"
                          :registry="registry"
                          :step="call"
                          :index="callIndex"
                          @hover="onHover"
                        ></ex-debug-stack>
                      </template>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header>Inspect</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <template v-for="(node, nodeIndex) in scopeNodes">
                      <ex-debug-node
                        :key="nodeIndex"
                        :registry="registry"
                        :node="node"
                      ></ex-debug-node>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-header>Steps</v-expansion-panel-header>
                  <v-expansion-panel-content style="max-height: 300px; overflow: scroll;">
                    <template v-for="(step, stepIndex) in stepsVisible">
                      <ex-debug-step
                        :key="stepIndex"
                        :step="step"
                        :index="stepIndex"
                        :registry="registry"
                        v-model="currentStep"
                      ></ex-debug-step>
                    </template>
                    <div v-intersect="onIntersect"></div>
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
import ExDebugStack from './DebugStack.vue';
import ExDebugNode from './DebugNode.vue';
import ExDebugStep from './DebugStep.vue';


export default Vue.extend({
  components: {
    ExDebugStack,
    ExDebugNode,
    ExDebugStep,
  },
  data: () => debugProgramDialog,
  computed: {
    step(): DebugStep {
      return this.steps[this.currentStep];
    },
    highlightMap(): Map<Expression, string> {
      return this.hoverStep
        ? new Map([[this.step.expr, '#BBDEFB'], [this.hoverStep.expr, '#ddf0ffc4']])
        : new Map([[this.step.expr, '#BBDEFB']]);
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

      nodes.push({
        sub: 'Context',
        subType: TextType.baseType,
        value: this.step.context,
        valueType: this.step.contextType,
      });

      if (this.step.resultType) {
        nodes.push({
          sub: 'Result',
          subType: TextType.baseType,
          value: this.step.result,
          valueType: this.step.resultType,
        });
      }

      return nodes;
    },
    disabledBack(): boolean {
      return this.currentStep === 0;
    },
    disabledForward(): boolean {
      return this.currentStep === this.steps.length - 1;
    },
    stepsVisible(): DebugStep[] {
      return this.steps.slice(0, this.stepsLoaded);
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
    onHover(step: DebugStep | null = null) {
      this.hoverStep = step;
    },
    onIntersect(entries: Array<{ isIntersecting: boolean }>) {
      if (entries[0].isIntersecting && this.stepsLoaded < this.steps.length) {
        this.stepsLoaded = Math.min(this.steps.length, this.stepsLoaded + 10);
      }
    },
  },
});
</script>

<style lang="less" scoped>
/deep/ .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>