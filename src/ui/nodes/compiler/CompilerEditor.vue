<template>
  <ex-compiler-editor
    v-bind="$props"
    v-on="$listeners"
  ></ex-compiler-editor>
</template>

<script lang="ts">
import { NodeTemplate } from 'expangine-ui';
import NodeEditorBase from '../NodeEditorBase';


export default NodeEditorBase<NodeTemplate>().extend({
  
});
</script>