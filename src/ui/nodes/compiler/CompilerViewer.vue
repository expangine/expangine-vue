<template>
  <ex-compiler-viewer
    v-bind="$props"
    v-on="$listeners"
  ></ex-compiler-viewer>
</template>

<script lang="ts">
import { NodeTemplate } from 'expangine-ui';
import NodeViewerBase from '../NodeViewerBase';


export default NodeViewerBase<NodeTemplate>().extend({
  
});
</script>