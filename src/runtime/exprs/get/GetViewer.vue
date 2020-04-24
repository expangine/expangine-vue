<template>
  <span>
    Get
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { GetExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<GetExpression>().extend({
  name: 'GetViewer',
});
</script>