<template>
  <span class="ex-center-aligned">

    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Not"
      tooltip="Negates the following expression"
      :can-remove="false"
    ></ex-expression-menu>

    <ex-expression
      key="expression"
      v-bind="$props"
      class="ex-inside ex-parenthesis"
      :value="value.expression"
      :required-type="conditionType"
      @input="updateExpression($event)"
      @remove="updateExpression()"
    ></ex-expression>

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