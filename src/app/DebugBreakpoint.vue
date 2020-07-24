<template>
  <div class="pa-1 ex-center-aligned ex-no-wrap"
    :class="classes"
    @mouseenter="enter"
    @mouseleave="exit">
    <v-icon 
      class="mx-1" 
      @click="toggle"
    >{{ toggleIcon }}</v-icon>
    <v-chip 
      small 
      label 
      class="ex-full-size"
      :color="exprColor"
      v-html="exprName"
    ></v-chip>
    <span 
      class="ex-single-line pl-1" 
      :title="exprDescribe"
      v-html="exprDescribe"
    ></span>
    <v-spacer></v-spacer>
    <v-icon 
      @click="remove"
    >mdi-minus-circle</v-icon>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, isArray, isBoolean } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    breakpoint: {
      type: Array,
      validator: (x) => isArray(x) && x[0] instanceof Expression && isBoolean(x[1]),
      required: true,
    },
    current: {
      type: Object as () => Expression,
      default: null,
    }, 
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  computed: {
    expr(): Expression {
      return this.breakpoint[0] as Expression;
    },
    enabled(): boolean {
      return this.breakpoint[1] as boolean;
    },
    exprName(): string {
      return this.registry.getExpressionName(this.expr);
    },
    exprDescribe(): string {
      return this.registry.getExpressionDescribe(this.expr);
    },
    exprColor(): string {
      return this.enabled
        ? 'red lighten-4'
        : 'grey lighten-2';
    },
    toggleIcon(): string {
      return this.enabled
        ? 'mdi-eye'
        : 'mdi-eye-off';
    },
    classes(): string {
      return this.expr === this.current
        ? 'blue lighten-4'
        : '';
    },
  },
  methods: {
    enter() {
      this.$emit('hover', this.breakpoint);
    },
    exit() {
      this.$emit('hover', null);
    },
    remove() {
      this.$emit('remove', this.breakpoint);
    },
    toggle() {
      this.$set(this.breakpoint, 1, !this.breakpoint[1]);
      this.$emit('toggled', this.breakpoint);
    },
  },
});
</script>