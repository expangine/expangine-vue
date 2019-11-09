<template>
  <div class="ex-center-aligned">
    <ex-expression
      v-bind="$props"
      class="ex-parenthesis"
      :value="value.value"
      @input="setValue"
      @remove="clearValue"
    ></ex-expression>
    <ex-path-editor
      v-bind="$props"
      :path="value.path"
      :root="valueType"
      @remove="onRemove"
      @input="onPathChange"
    ></ex-path-editor>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, SubExpression, NoExpression } from 'expangine-runtime';
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
    onPathChange() {
      if (this.value.path.length === 0) {
        this.onRemove();
      } else {
        this.update();
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
  },
});
</script>