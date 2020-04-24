<template>
  <span>
    <template v-for="(segment, index) in value.expressions">
      <span :key="index">
        {{ getSegmentPrefix(segment, index) }}
        <ex-expression
          v-bind="$props"
          v-on="$listeners"
          :class="getSegmentClass(segment)"
          :value="segment"
        ></ex-expression>
      </span>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, isString, ConstantExpression, PathExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<PathExpression>().extend({
  name: 'PathViewer',
  methods: {
    getSegmentClass(segment: Expression) {
      return (segment instanceof ConstantExpression && isString(segment.value)) || segment.isPathNode()
        ? ''
        : 'ex-brackets';
    },
    getSegmentPrefix(segment: Expression, index: number) {
      return (segment instanceof ConstantExpression && isString(segment.value)) || segment.isPathNode()
        ? (index > 0 ? '.' : '')
        : '';
    },
  },
});
</script>