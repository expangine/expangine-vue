<template>
  <div>
    <h3>Expression</h3>
    <ex-expression-edit-button
      v-model="expression"
      :context="context"
      :registry="registry"
      :read-only="readOnly"
    ></ex-expression-edit-button>
  </div>
</template>

<script lang="ts">
import { Expression, isArray } from 'expangine-runtime';
import NodeEditorBase from '../NodeEditorBase';

export default NodeEditorBase<Expression>().extend({
  computed: {
    expression: {
      get(): Expression {
        return isArray(this.value)
          ? this.registry.defs.getExpression(this.value)
          : this.value;
      },
      set(expr: Expression) {
        this.input(expr);
      },
    },
  },
});
</script>