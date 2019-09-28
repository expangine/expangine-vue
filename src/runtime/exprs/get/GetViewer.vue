<template>
  <span>
    <template v-for="(segment, index) in value.path">
      <span :key="index">
        {{ getSegmentPrefix(segment, index) }}
        <ex-expression
          v-bind="$props"
          v-on="$listeners"
          :value="segment"
        ></ex-expression>
        {{ getSegmentSuffix(segment, index) }}
      </span>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, GetExpression, isString, ConstantExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<GetExpression>().extend({
  name: 'GetViewer',
  methods: {
    getSegmentPrefix(segment: Expression, index: number) {
      return segment instanceof ConstantExpression && isString(segment.value)
        ? index > 0 ? '.' : '' : '[';
    },
    getSegmentSuffix(segment: Expression, index: number) {
      return segment instanceof ConstantExpression && isString(segment.value)
        ? '' : ']';
    },
  },
});
</script>