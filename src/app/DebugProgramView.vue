<template>
  <v-card class="ex-debug-view" :class="classes">
    <v-card-title class="pa-0">
      <v-toolbar flat dense class="ex-accent-bar" v-sticky.x.y="stickyTarget">

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn icon @click="toggleVertical" v-on="on">
              <v-icon>{{ verticalIcon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ verticalText }}</span>
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on }">
            <v-btn v-if="sticky" icon @click="toggleSticky" v-on="on">
              <v-icon>{{ stickyIcon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ stickyText }}</span>
        </v-tooltip>

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

        <v-chip small label :title="elapsedTitle" class="px-1">
          {{ elapsedText }}
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
          :context="step.contextType"
          :registry="registry"
          :highlight="highlightMap"
          :event-listeners="eventListeners"
        ></ex-expression>

      </div>
      <div class="debug-inspect elevation-1">

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
                  :value="debug.current.step"
                  @hover="onHoverStep"
                  @input="debug.stepTo($event)"
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
import { Expression, Types } from 'expangine-runtime';
import { Debugger, DebugStep, DebugBreakpoint } from './Debugger';
import { ExpressionEventListeners } from '../runtime/exprs/ExpressionBase';
import { TypeSubNode } from '../runtime/types/TypeVisuals';
import { Registry } from '../runtime/Registry';
import ExDebugStack from './DebugStack.vue';
import ExDebugNode from './DebugNode.vue';
import ExDebugStep from './DebugStep.vue';
import ExDebugBreakpoint from './DebugBreakpoint.vue';
import { Preferences, PreferenceCategory } from './Preference';



const PREF_ORIENTATION = Preferences.define({
  key: 'expression_debug_orientation',
  label: 'Debugger vertical toolbar orientation',
  category: [PreferenceCategory.DEBUGGER],
  defaultValue: null as null | boolean,
  type: Types.bool(),
});

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
    vertical: {
      type: Boolean,
      default: false,
    },
    sticky: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hoverExpression: null as null | Expression,
    stepsLoaded: 0,
    breakpointSet: false,
    breakpoint: null as null | Expression,
    topOffset: 0,
    stickyEnabled: true,
    internalVertical: Preferences.get(PREF_ORIENTATION),
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
    isVertical(): boolean {
      return this.internalVertical !== null
        ? this.internalVertical 
        : this.vertical;
    },
    verticalIcon(): string {
      return this.isVertical ? 'mdi-arrow-right' : 'mdi-arrow-down';
    },
    verticalText(): string {
      return this.isVertical ? 'Switch to Horizontal' : 'Switch to Vertical';
    },
    stickyIcon(): string {
      return this.vertical
        ? 'mdi-arrow-up-down'
        : 'mdi-arrow-left-right';
    },
    stickyText(): string {
      return this.stickyEnabled ? 'Disable Auto Scrolling' : 'Enable Auto Scrolling';
    },
    stickyTarget(): string | false {
      return this.sticky && this.stickyEnabled ? '.v-toolbar__content' : false;
    },
    classes(): any {
      return {
        vertical: this.isVertical,
      };
    },
    elapsedText(): string {
      return this.isVertical ? this.debug.elapsed.elapsedShort : this.elapsedTitle;
    },
    elapsedTitle(): string {
      return `Stepped in ${this.debug.elapsed.elapsedSecondsFormatted}s`;
    },
  },
  methods: {
    toggleVertical() {
      this.internalVertical = !this.isVertical;

      Preferences.set(PREF_ORIENTATION, this.internalVertical);
    },
    updateTopOffset() {
      const rect = this.$el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      this.topOffset = rect.top + scrollTop;
    },
    gotoClick(ev: Event, expr: Expression) {
      if (this.breakpointSet) {
        this.breakpoint = expr;

        ev.stopPropagation();
        ev.preventDefault();
      }
    },
    toggleSticky() {
      this.stickyEnabled = !this.stickyEnabled;
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
  display: flex;
  flex-direction: row;

  .debug-program {
    flex: 1 1 auto;
    overflow: scroll;
    width: 0;
  }

  .debug-inspect {
    flex: 0 0 300px;
    overflow: scroll;
    min-width: 300px;
  }
}

.ex-debug-view {

  &.vertical {
    display: flex;
    
    /deep/ .v-toolbar {
      width: 48px;
      height: auto !important;
      flex: 0 0 48px;

      .v-toolbar__content {
        width: 48px;
        height: auto !important;
        padding: 16px 0 !important;
        flex-direction: column;

        & > .v-btn.v-btn--icon:first-child {
          margin-left: 0px;
          margin-top: -12px;
        }

        & > .v-btn.v-btn--icon:last-child {
          margin-right: 0px;
          margin-bottom: -12px;
        }
      }
    }    
  }
}
</style>