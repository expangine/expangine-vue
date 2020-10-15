<template>
  <span>
    <div class="ex-node-label">
      {{ label }}
    </div>
    {{ text }}
  </span>
</template>

<script lang="ts">
import { Expression, isArray } from 'expangine-runtime';
import NodeViewerBase from '../NodeViewerBase';

export default NodeViewerBase<Expression>().extend({
  computed: {
    expression(): Expression {
      return isArray(this.value)
        ? this.registry.defs.getExpression(this.value)
        : this.value;
    },
    text(): string {
      return this.registry.getExpressionDescribe(this.expression) || 'No Expression';
    },
  },
});
</script>