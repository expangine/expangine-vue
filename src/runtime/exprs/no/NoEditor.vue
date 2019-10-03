<template>
  <span></span>
</template>

<script lang="ts">
import Vue from 'vue';
import { NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<NoExpression>().extend({
  name: 'NoEditor',
});
</script>