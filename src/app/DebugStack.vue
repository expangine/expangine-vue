<template>
  <div class="pa-1 ex-center-aligned ex-no-wrap"
    @mouseenter="enter"
    @mouseleave="exit">
    <v-chip 
      small 
      label
      class="ex-full-size"
      :color="color"
      v-html="exprName"
    ></v-chip>
    <span 
      class="ml-1 ex-single-line"
      :title="exprDescribe"
      v-html="exprDescribe"
    ></span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
import { DebugStep } from './Debugger';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    step: {
      type: Object as () => DebugStep,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  computed: {
    exprName(): string {
      return this.registry.getExpressionName(this.step.expr);
    },
    exprDescribe(): string {
      return this.registry.getExpressionDescribe(this.step.expr);
    },
    isCurrent(): boolean {
      return this.index === 0;
    },
    color(): string {
      return this.isCurrent ? 'primary' : 'theme--light';
    },
  },
  methods: {
    enter() {
      this.$emit('hover', this.step);
    },
    exit() {
      this.$emit('hover', null);
    },
  },
});
</script>