<template>
  <div v-if="hasValue">
    <component
      :is="'ex-expression'"
      v-bind="$props"
      v-on="$listeners"
    ></component>
  </div>
  <div v-else>
    Select a {{ type }} expression...
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ExpressionBase from './ExpressionBase';


export default ExpressionBase().extend({
  props: {
    type: {
      type: String,
      required: true,
    },
  },
});
</script>