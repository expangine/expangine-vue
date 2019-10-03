<template>
  <div class="pl-3">
    <ex-expression-menu
      v-bind="$props"
      v-on="$listeners"
      text="Get"
      tooltip="Get a data value"
    ></ex-expression-menu>
    <ex-path-editor
      v-bind="$props"
      v-on="$listeners"
      :path="value.path"
    ></ex-path-editor>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { GetExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<GetExpression>().extend({
  name: 'GetEditor',
});
</script>