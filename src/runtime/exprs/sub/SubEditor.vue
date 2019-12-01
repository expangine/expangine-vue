<template>
  <div class="ex-center-aligned sub-editor">

    <ex-expression
      v-bind="$props"
      :value="value.value"
      @input="setValue"
      @remove="clearValue"
      @input:root="onRootChange"
    ></ex-expression>

    <ex-path-editor
      v-bind="$props"
      allow-computed
      :path="value.path"
      :root="valueType"
      @remove="onRemove"
      @input="onPathChange"
    ></ex-path-editor>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, SubExpression, NoExpression, ComputedExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<SubExpression>().extend({
  name: 'SubEditor',
  computed: {
    valueType(): Type | null {
      return this.value.value.getType(this.registry.defs, this.context);
    },
  },
  methods: {
    onRemove() {
      this.input(this.value.value);
    },
    onPathChange(value: Expression) {
      if (this.value.path.length === 0 && !(value instanceof ComputedExpression)) {
        this.onRemove();
      } else {
        this.input(value);
      }
    },
    clearValue() {
      this.value.value = NoExpression.instance;
      this.update();
    },
    setValue(value: Expression) {
      this.value.value = value;
      this.update();
    },
    onRootChange(input: Expression) {
      const parent = this.value.parent;
      if (parent instanceof SubExpression || parent instanceof ComputedExpression) {
        this.$emit('input:root', input);
      } else {
        this.input(input);
      }
    },
  },
});
</script>