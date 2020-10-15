<template>
  <span>
    <div class="ex-node-label">
      {{ label }}
    </div>
    {{ text }}
  </span>
</template>

<script lang="ts">
import NodeViewerBase from '../NodeViewerBase';


export default NodeViewerBase<string>().extend({
  computed: {
    text(): string {
      return this.value || '(empty text)';
    },
  },
});
</script>