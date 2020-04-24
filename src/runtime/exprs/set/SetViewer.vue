<template>
  <span class="set-viewer">
    <ex-path-viewer
      v-bind="$props"
      v-on="$listeners"
      :value="value.path"
    ></ex-path-viewer>
    <span class="px-3">=</span>
    <ex-expression
      v-bind="$props"
      :value="value.value"
    ></ex-expression>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { SetExpression, NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<SetExpression>().extend({
  name: 'SetViewer',
});
</script>

<style lang="less" scoped>
.set-viewer {
  display: flex;
  align-items: flex-start;
}
</style>