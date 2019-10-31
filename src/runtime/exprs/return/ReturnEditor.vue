<template>
  <span class="return-editor pl-3">
    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Return"
      tooltip="Exit the expression now, optionally returning a value"
      :can-remove="false"
    ></ex-expression-menu>
    <ex-expression
      key="value"
      v-bind="$props"
      class="expression-inside parenthesis"
      :value="value.value"
      :required-type="null"
      @input="updateValue($event)"
      @remove="updateValue()"
    ></ex-expression>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, ChainExpression, ReturnExpression, ExpressionBuilder, NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ReturnExpression>().extend({
  name: 'ReturnEditor',
  methods: {
    updateValue(expr?: Expression) {
      this.value.value = expr || NoExpression.instance;
      this.update();
    },
  },
});
</script>

<style lang="less" scoped>
.return-editor {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>