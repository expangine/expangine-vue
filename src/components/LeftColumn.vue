<template>
  <span class="ex-left-column">
    <span class="left" v-if="hasLeft">
      <slot name="left"></slot>
    </span>
    <span class="right">
      <slot></slot>
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';


export default Vue.extend({
  name: 'LeftColumn',
  props: {
    hasLeft: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style lang="less" scoped>
.ex-left-column {
  display: flex;
  align-items: center;

  .left {
    flex: 0 0 36px;
  }
  .right {
    flex: 1 0 0px;
  }
}
</style>