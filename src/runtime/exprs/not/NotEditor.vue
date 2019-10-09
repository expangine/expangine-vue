<template>
  <span class="pl-3">
    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Not"
      tooltip="Negates the following expression"
      :can-remove="false"
    ></ex-expression-menu>
    <ex-symbol key="open" type="("></ex-symbol>
    <ex-expression
      key="expression"
      v-bind="$props"
      type="condition"
      class="expression-inside"
      :value="value.expression"
      :required-type="conditionType"
      @input="updateExpression($event)"
      @remove="updateExpression()"
    ></ex-expression>
    <ex-symbol key="close" type=")"></ex-symbol>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, ChainExpression, NotExpression, ExpressionBuilder, NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<NotExpression>().extend({
  name: 'NotEditor',
  methods: {
    updateExpression(expr?: Expression) {
      this.value.expression = expr || NoExpression.instance;
      this.update();
    },
  },
});
</script>