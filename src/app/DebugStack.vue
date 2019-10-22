<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon v-if="isCurrent">mdi-arrow-right-bold</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      {{ exprName }}
    </v-list-item-content>
  </v-list-item>      
</template>

<script lang="ts">
import Vue from 'vue';
import { DebugStep } from './DebugProgram';
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
    classes(): string {
      return this.index % 2 === 1
        ? 'grey lighten-5'
        : '';
    },
    isCurrent(): boolean {
      return this.index === 0;
    },
  },
});
</script>