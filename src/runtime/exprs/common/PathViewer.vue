<template>
  <span>
    <template v-for="(segment, index) in path">
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
import { Expression, isString, ConstantExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase().extend({
  name: 'PathViewer',
  props: {
    path: {
      type: Array as () => Expression[],
      required: true,
    },
  },
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