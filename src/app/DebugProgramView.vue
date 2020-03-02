<template>
  <v-card>
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
          Stepped in {{ debugs.elapsed.elapsedSecondsFormatted }}s
        </v-chip>

        <v-spacer></v-spacer>

        <v-btn v-if="!hideClose" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>

      </v-toolbar>

    </v-card-title>
    <v-card-text class="pa-0 debug-pane">
      <div class="debug-program">

        <ex-expression
          :value="step.program"
          :context="inputType"
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
                    @remove="removeBreakpoint(breakpoint)"
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
                  :value="debugs.current.step"
                  @hover="onHoverStep"
                  @input="debugs.stepTo($event)"
                ></ex-debug-step>
              </template>
              <div v-intersect="onIntersect"></div>
            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-expansion-panels>

      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, TextType } from 'expangine-runtime';
import { debugProgramDialog } from './DebugProgram';
import { Debugger, DebugStep, DebugBreakpoint } from './Debugger';
import { ExpressionEventListeners } from '../runtime/exprs/ExpressionBase';
import { TypeSubNode } from '../runtime/types/TypeVisuals';
import { measure, StopWatchOutput } from './StopWatch';
import { Registry } from '../runtime/Registry';
import ExDebugStack from './DebugStack.vue';
import ExDebugNode from './DebugNode.vue';
import ExDebugStep from './DebugStep.vue';
import ExDebugBreakpoint from './DebugBreakpoint.vue';


export default Vue.extend({
  components: {
    ExDebugStack,
    ExDebugNode,
    ExDebugStep,
    ExDebugBreakpoint,
  },
  props: {
    debug: {
      type: Object as () => Debugger,
      default: null,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hoverExpression: null as null | Expression,
    stepsLoaded: 0,
    breakpointSet: false,
    breakpoint: null as null | Expression,
  }),
  computed: {
    step(): DebugStep {
      return this.debug.current.stepDebug;
    },
    stepName(): string {
      return this.registry.getExpressionName(this.step.expr);
    },
    breakpoints(): DebugBreakpoint[] {
      return Array.from(this.debug.breakpoints.entries());
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
    callstack(): DebugStep[] {
      return this.debug.getCallstack();
    },
    scopeNodes(): TypeSubNode[] {
      return this.debug.getScopeNodes();
    },
    disabledBack(): boolean {
      return this.debug.current.step === 0;
    },
    disabledForward(): boolean {
      return this.debug.current.end;
    },
    stepsVisible(): DebugStep[] {
      return this.debug.steps.slice(0, this.stepsLoaded);
    },
    stepBackLabel(): string {
      const step = this.getStepName(this.debug.current.stepBack);

      return step ? ' to ' + step : '';
    },
    stepIntoLabel(): string {
      return this.stepName;
    },
    stepOverLabel(): string {
      return this.stepName;
    },
    stepOutLabel(): string {
      const step = this.getStepName(this.debug.current.stepBack);

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
        this.debug.addBreakpoint(this.breakpoint);
      }
      this.gotoCancel();
    },
    gotoCancel() {
      this.breakpointSet = false;
      this.breakpoint = null;
    },
    getStep(index: number): DebugStep | undefined {
      return this.debug.steps.find((s) => s.index === index);
    },
    getStepName(index: number): string {
      const step = this.getStep(index);

      return step ? this.registry.getExpressionName(step.expr) : '';
    },
    removeBreakpoint(expr: Expression) {
      this.debug.removeBreakpoint(expr);
    },
    close() {
      this.$emit('close');
    },
    first() {
      this.debug.first();
    },
    stepBack() {
      this.debug.stepBack();
    },
    stepInto() {
      this.debug.stepInto();
    },
    stepOver() {
      this.debug.stepOver();
    },
    stepOut() {
      this.debug.stepOut();
    },
    stepToBreakpoint() {
      this.debug.stepToBreakpoint();
    },
    last() {
      this.debug.last();
    },
    onHoverStep(step: DebugStep | null = null) {
      this.hoverExpression = step ? step.expr : null;
    },
    onHoverBreakpoint(breakpoint: DebugBreakpoint | null = null) {
      this.hoverExpression = breakpoint ? breakpoint[0] : null;
    },
    onIntersect(entries: Array<{ isIntersecting: boolean }>) {
      if (entries[0].isIntersecting && this.stepsLoaded < this.debug.steps.length) {
        this.stepsLoaded = Math.min(this.debug.steps.length, this.stepsLoaded + 10);
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