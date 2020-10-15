<template>
  <component 
    v-if="hasViewer"
    :is="visuals.viewer"
    v-bind="$props"
    v-on="$listeners"
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
import CompilerViewerBase from './CompilerViewerBase';

export default CompilerViewerBase().extend({
  computed: {
    hasViewer(): boolean {
      return Boolean(this.visuals && this.visuals.viewer);
    },
  },
});
</script>