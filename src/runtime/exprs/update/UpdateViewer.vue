<template>
  <span>
    <ex-path-viewer
      v-bind="$props"
      v-on="$listeners"
      :value="value.path"
    ></ex-path-viewer>
    =
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
  name: 'UpdateViewer',
});
</script>