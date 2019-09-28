<template>
  <span>{{ value.value }}</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { ConstantExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ConstantExpression>().extend({
  name: 'ConstantViewer',
});
</script>