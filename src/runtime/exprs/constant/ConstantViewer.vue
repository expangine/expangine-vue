<template>
  <span>{{ readonlyValue }}</span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ConstantExpression, isArray, isObject } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ConstantExpression>().extend({
  name: 'ConstantViewer',
  computed: {
    inputType(): Type | null {
      return this.computedType || this.requiredType;
    },
    readonlyValue(): string {
      return this.computedType
        ? this.registry.getTypeToString(this.value.value, this.computedType, '', '&nbsp;&nbsp;')
        : this.value.value + '';
    },
  },
});
</script>