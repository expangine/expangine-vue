<template>
  <span class="ex-center-aligned">
    <path-segment
      v-bind="$props"
      :this-type="context"
      :index="0"
      :sub-settings="settings"
      :allow-computed="allowComputed"
      :allow-methods="allowMethods"
      @input="input"
      @remove="remove"
      @settings="onSettings"
    ></path-segment>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { PathExpression } from 'expangine-runtime';
import { TypeSettings } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';
import PathSegment from './PathSegment.vue';



export default ExpressionBase<PathExpression>().extend({
  name: 'PathEditor',
  components: {
    PathSegment,
  },
  props: {
    allowComputed: {
      type: Boolean,
      default: false,
    },
    allowMethods: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onSettings(settings: TypeSettings | null) {
      this.$emit('settings', settings);
    },
  },
});
</script>