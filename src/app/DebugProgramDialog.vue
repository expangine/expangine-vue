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
            <span>Step Back {{ stepBackLabel }}</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="stepInto">
                <v-icon>mdi-debug-step-into</v-icon>
              </v-btn>
            </template>
            <span>Step Into {{ stepIntoLabel }}</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="stepOver">
                <v-icon>mdi-debug-step-over</v-icon>
              </v-btn>
            </template>
            <span>Step Over {{ stepOverLabel }}</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="stepOut">
                <v-icon>mdi-debug-step-out</v-icon>
              </v-btn>
            </template>
            <span>Step Out {{ stepOutLabel }}</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon v-on="on" :disabled="breakpoints.length === 0" @click="stepToBreakpoint">
                <v-icon>mdi-play</v-icon>
              </v-btn>
            </template>
            <span>Step to Next Breakpoint</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000" v-if="!breakpointSet">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="gotoStart">
                <v-icon>mdi-checkbox-blank-circle</v-icon>
              </v-btn>
            </template>
            <span>Add Breakpoint</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000" v-if="breakpointSet && breakpoint">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="gotoEnd">
                <v-icon>mdi-plus-circle</v-icon>
              </v-btn>
            </template>
            <span>Add Breakpoint {{ registry.getExpressionName(breakpoint) }}</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000" v-if="breakpointSet">
            <template #activator="{ on }">
              <v-btn icon v-on="on" @click="gotoCancel">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </template>
            <span>Cancel Set Breakpoint</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="1000">
            <template #activator="{ on }">
              <v-btn icon :disabled="disabledForward" v-on="on" @click="last">
                <v-icon>mdi-skip-forward</v-icon>
              </v-btn>
            </template>
            <span>End Debugging</span>
          </v-tooltip>

          <v-chip label>
            Stepped in {{ elapsed.elapsedSecondsFormatted }}s
          </v-chip>

          <v-spacer></v-spacer>

          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>

        </v-toolbar>

      </v-card-title>
      <v-card-text class="pa-0 debug-pane">
        <div class="debug-program">

          <ex-expression
            :value="step.program"
            :context="type"
            :registry="registry"
            :highlight="highlightMap"
            :event-listeners="eventListeners"
          ></ex-expression>

        </div>
        <div class="debug-inspect">

          <v-expansion-panels accordion focusable multiple>

            <v-expansion-panel>
              <v-expansion-panel-header>Breakpoints</v-expansion-panel-header>
              <v-expansion-panel-content class="pa-0">
                <v-list dense>
                  <template v-for="(breakpoint, breakpointIndex) in breakpoints">
                    <ex-debug-breakpoint
                      :key="breakpointIndex"
                      :breakpoint="breakpoint"
                      :registry="registry"
                      :current="step.expr"
                      @hover="onHoverBreakpoint"
                      @remove="removeBreakpoint(breakpointIndex)"
                    ></ex-debug-breakpoint>
                  </template>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>

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
                      @hover="onHoverStep"
                    ></ex-debug-stack>
                  </template>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Inspect</v-expansion-panel-header>
              <v-expansion-panel-content class="pl-1 pb-1">
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
                <template v-for="step in stepsVisible">
                  <ex-debug-step
                    :key="step.index"
                    :step="step"
                    :index="step.index"
                    :registry="registry"
                    :value="currentStep.step"
                    @hover="onHoverStep"
                    @input="gotoStep"
                  ></ex-debug-step>
                </template>
                <div v-intersect="onIntersect"></div>
              </v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>

        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, TextType } from 'expangine-runtime';
import { debugProgramDialog, debugProgram, DebugStep, DebugBreakpoint } from './DebugProgram';
import { ExpressionEventListeners } from '../runtime/exprs/ExpressionBase';
import { TypeSubNode } from '../runtime/types/TypeVisuals';
import ExDebugStack from './DebugStack.vue';
import ExDebugNode from './DebugNode.vue';
import ExDebugStep from './DebugStep.vue';
import ExDebugBreakpoint from './DebugBreakpoint.vue';
import { measure } from './StopWatch';


export default Vue.extend({
  components: {
    ExDebugStack,
    ExDebugNode,
    ExDebugStep,
    ExDebugBreakpoint,
  },
  data: () => debugProgramDialog,
  computed: {
    step(): DebugStep {
      return this.currentStep.stepDebug;
    },
    stepName(): string {
      return this.registry.getExpressionName(this.step.expr);
    },
    highlightMap(): Map<Expression, string> {
      const highlights = new Map();
      
      if (this.breakpoint) {
        highlights.set(this.breakpoint, '#9CCC65');
      } else {
        this.breakpoints.forEach(([breakpoint, enabled]) => {
          if (enabled) {
            highlights.set(breakpoint, '#FFCDD2');
          }
        });
      }

      if (this.hoverExpression) {
        highlights.set(this.hoverExpression, '#DDF0FFC4');
      }

      if (!this.breakpointSet) {
        if (highlights.has(this.step.expr)) {
          highlights.set(this.step.expr, '#E1BEE7');
        } else {
          highlights.set(this.step.expr, '#BBDEFB');
        }
      }

      return highlights;
    },
    initialStep(): DebugStep {
      return {
        type: 'enter',
        depth: -1,
        index: -1,
        program: this.program,
        expr: this.program,
        context: this.data,
        contextType: this.type,
      };
    },
    callstack(): DebugStep[] {
      const stack: DebugStep[] = [];
      const { step, steps } = this;
      const currentIndex = this.currentStep.stepDebug.index;
      let currentStep = this.steps.findIndex((s) => s.index === currentIndex);

      let depth = step.depth;
      while (currentStep >= 0) { 
        const current = steps[currentStep];
        if (current.depth === depth) {
          stack.push(current);
          depth--;
        }
        currentStep--;
      }

      stack.push(this.initialStep);
      
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
      return this.currentStep.step === 0;
    },
    disabledForward(): boolean {
      return this.currentStep.end;
    },
    stepsVisible(): DebugStep[] {
      return this.steps.slice(0, this.stepsLoaded);
    },
    stepBackLabel(): string {
      const step = this.getStepName(this.currentStep.stepBack);

      return step ? ' to ' + step : '';
    },
    stepIntoLabel(): string {
      return this.stepName;
    },
    stepOverLabel(): string {
      return this.stepName;
    },
    stepOutLabel(): string {
      const step = this.getStepName(this.currentStep.stepBack);

      return step ? ' of ' + step : '';
    },
    eventListeners(): ExpressionEventListeners {
      return { click: this.gotoClick };
    },
    breakpointMap(): Map<Expression, boolean> {
      return new Map(this.breakpoints);
    },
  },
  methods: {
    gotoClick(ev: Event, expr: Expression) {
      if (this.breakpointSet) {
        this.breakpoint = expr;

        ev.stopPropagation();
        ev.preventDefault();
      }
    },
    gotoStart() {
      this.breakpointSet = true;
      this.breakpoint = null;
    },
    gotoEnd() {
      if (this.breakpoint) {
        this.breakpoints.push([this.breakpoint, true]);
      }
      this.gotoCancel();
    },
    gotoCancel() {
      this.breakpointSet = false;
      this.breakpoint = null;
    },
    getStep(index: number): DebugStep | undefined {
      return this.steps.find((s) => s.index === index);
    },
    getStepName(index: number): string {
      const step = this.getStep(index);

      return step ? this.registry.getExpressionName(step.expr) : '';
    },
    sortSteps() {
      this.steps.sort((a, b) => a.index - b.index);
    },
    pushCurrentStep() {
      const currentStep = this.currentStep.stepDebug;
      const currentStepIndex = this.steps.findIndex((s) => s.index === currentStep.index);
      if (currentStepIndex === -1) {
        this.steps.push(currentStep);
        this.sortSteps();
      } else {
        this.$set(this.steps, currentStepIndex, currentStep);
      }
    },
    gotoStep(index: number, stopAt?: Map<Expression, boolean>) {
      this.elapsed = measure(() => debugProgram(index, stopAt));
      this.currentStep = this.elapsed.result;
      this.pushCurrentStep();
    },
    removeBreakpoint(index: number) {
      this.breakpoints.splice(index, 1);
    },
    first() {
      this.gotoStep(0);
    },
    last() {
      this.gotoStep(9007199254740991);
    },
    stepBack() {
      this.gotoStep(this.currentStep.stepBack);
    },
    stepInto() {
      this.gotoStep(this.currentStep.stepInto);
    },
    stepOver() {
      this.gotoStep(this.currentStep.stepOver);
    },
    stepOut() {
      this.gotoStep(this.currentStep.stepOut);
    },
    stepToBreakpoint() {
      const start = this.currentStep.step;
      if (this.breakpointMap.has(this.step.expr)) {
        this.gotoStep(start + 1, this.breakpointMap);
        if (!this.breakpointMap.has(this.step.expr)) {
          this.last();
        }
      } else {
        const startingStep = this.currentStep.step;
        this.gotoStep(start, this.breakpointMap);
        if (this.currentStep.step === start) {
          this.last();
        }
      }
    },
    onHoverStep(step: DebugStep | null = null) {
      this.hoverExpression = step ? step.expr : null;
    },
    onHoverBreakpoint(breakpoint: DebugBreakpoint | null = null) {
      this.hoverExpression = breakpoint ? breakpoint[0] : null;
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

.debug-pane {
  position: relative;

  .debug-program {
    position: absolute;
    top: 0;
    left: 0;
    right: 300px;
    bottom: 0;
    overflow: scroll;
  }

  .debug-inspect {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    bottom: 0;
    overflow: scroll;
  }
}
</style>