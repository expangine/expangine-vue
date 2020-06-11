<template>
  <div class="ex-center-aligned pl-0">
    
    <ex-expression-menu
      v-bind="$props"
      v-on="$listeners"
      text="Get"
      tooltip="Get a data value"
    ></ex-expression-menu>

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