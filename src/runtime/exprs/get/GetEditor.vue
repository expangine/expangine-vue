<template>
  <div class="ex-center-aligned pl-0">

    <ex-expression-menu
      v-bind="$props"
      text="Get"
      tooltip="Get a data value"
      :value="rootExpression"
      @remove="remove"
      @input="onChange"
    ></ex-expression-menu>

    <ex-path-editor
      v-bind="$props"
      v-on="$listeners"
      allow-computed
      :path="value.path"
    ></ex-path-editor>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, GetExpression, SubExpression, ComputedExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<GetExpression>().extend({
  name: 'GetEditor',
  computed: {
    rootExpression(): Expression {
      let root: Expression = this.value;
      while ((root.parent instanceof SubExpression) || (root.parent instanceof ComputedExpression)) {
        root = root.parent;
      }
      return root;
    },
  },
  methods: {
    onChange(input: Expression) {
      if (this.value === this.rootExpression) {
        this.input(input);
      } else {
        this.$emit('input:root', input);
      }
    },
  },
});
</script>