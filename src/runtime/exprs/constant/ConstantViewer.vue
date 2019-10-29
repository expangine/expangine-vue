<template>
  <ex-data-string
    html
    single-line
    :registry="registry"
    :data="value.value"
    :type="computedType"
  ></ex-data-string>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ConstantExpression, isArray, isObject } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ConstantExpression>().extend({
  name: 'ConstantViewer',
});
</script>