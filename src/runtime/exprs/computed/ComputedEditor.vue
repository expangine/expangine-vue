<template>
  <span>{{ name }}</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { ComputedExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ComputedExpression>().extend({
  name: 'ComputedEditor',
  computed: {
    name(): string {
      return this.value.name.split(':')[1] || this.value.name;
    },
  },
});
</script>