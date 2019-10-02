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
      if (!this.inputType) {
        return this.value.value + '';
      }
      const value = this.inputType.toJson(this.value.value);

      return isArray(value) || isObject(value)
        ? JSON.stringify(value)
        : value;
    },
  },
});
</script>