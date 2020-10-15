<template>
  <component 
    v-if="hasViewer"
    :is="visuals.viewer"
    v-bind="$props"
    v-on="$listeners"
    class="ex-node"
    @click.stop.native="selected"
  ></component>
  <v-alert
    v-else
    dense
    colored-border
    elevation="1"
    type="error"
    icon="mdi-alert"
    border="left"
    class="mb-0"
  >
    This component does not have visuals.
  </v-alert>
</template>

<script lang="ts">
import NodeViewerBase from './NodeViewerBase';

export default NodeViewerBase().extend({
  computed: {
    hasViewer(): boolean {
      return Boolean(this.visuals && this.visuals.viewer);
    },
  },
});
</script>

<style lang="less" scoped>
.ex-node {
  border: 1px solid transparent;
  position: relative;

  /deep/ .ex-node-label {
    display: none;
    position: absolute;
    right: 0;
    top: -16px;
    background-color: rgba(0,0,0,0.7);
    font-size: 12px;
    color: white;
    padding: 2px;
    line-height: 12px;
    
    &.left {
      right: auto;
      left: 0;
    }
    &.persistent {
      display: inline-block;
      top: 0;
      position: relative;
    }
  }

  &:hover {
    border: 1px solid rgba(0,0,0,0.1);

    /deep/ .ex-node-label {
      display: inline-block;
    }
  }
}
</style>