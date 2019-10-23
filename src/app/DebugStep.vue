<template>
  <div class="pa-1"
    :class="classes"
    :style="style"
    @mouseenter="enter"
    @mouseleave="exit"
    @click="select">
    <v-icon>{{ icon }}</v-icon>
    <v-chip 
      small 
      label 
      v-html="exprName"
    ></v-chip>
    <span 
      class="ml-1"
      v-html="returnType"
    ></span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
import { DebugStep } from './DebugProgram';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    step: {
      type: Object as () => DebugStep,
      required: true,
    },
    value: {
      type: Number,
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
    relativeIndex(): number {
      return this.index - this.value;
    },
    icon(): string {
      return this.step.type === 'enter' 
        ? 'mdi-subdirectory-arrow-right' 
        : 'mdi-chevron-left';
    },
    style(): any {
      return {
        'margin-left': this.step.depth * 8 + 'px', 
      };
    },
    classes(): string {
      return this.relativeIndex === 0
        ? 'blue lighten-4'
        : this.relativeIndex < 0
          ? 'blue lighten-5'
          : '';
    },
    returnType(): string {
      const returnType = this.step.expr.getType(this.registry.defs, this.step.contextType);
      if (!returnType) {
        return '';
      }
      return this.registry.getTypeDescribe(returnType);
    },
  },
  methods: {
    enter() {
      this.$emit('hover', this.step);
    },
    exit() {
      this.$emit('hover', null);
    },
    select() {
      this.$emit('input', this.index);
    },
  },
});
</script>