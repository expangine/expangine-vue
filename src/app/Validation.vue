<template>
  <div class="pa-2 ex-center-aligned ex-no-wrap"
    @mouseenter="enter"
    @mouseleave="exit">
    <v-icon class="mr-1" :class="iconColor">{{ icon }}</v-icon>
    <v-chip 
      v-if="exprName"
      small 
      label 
      class="ex-full-size"
      v-html="exprName"
    ></v-chip>
    <span 
      class="ml-2"
      :title="exprDescribe"
      v-html="exprDescribe"
    ></span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Validation, ValidationSeverity } from 'expangine-runtime';
import { ValidationHelper } from '@/app/ValidationHelper';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    validation: {
      type: Object as () => Validation,
    },
    registry: {
      type: Object as () => Registry,
    },
  },
  computed: {
    icon(): string {
      return ValidationHelper.ICONS[this.validation.severity];
    },
    iconColor(): string {
      return ValidationHelper.COLORS[this.validation.severity];
    },
    exprName(): string {
      return this.validation.subject
        ? this.registry.getExpressionName(this.validation.subject)
        : this.validation.parent
          ? this.registry.getExpressionName(this.validation.parent)
          : '';
    },
    exprDescribe(): string {
      return ValidationHelper.getDescription(this.validation, this.registry);
    },
  },
  methods: {
    enter() {
      this.$emit('hover', this.validation);
    },
    exit() {
      this.$emit('hover', null);
    },
  },
});
</script>

<style lang="less" scoped>
.ex-center-aligned:hover {
  background-color: rgba(0,0,255,0.05);
}
</style>