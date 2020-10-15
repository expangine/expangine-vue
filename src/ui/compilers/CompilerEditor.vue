<template>
  <component 
    v-if="hasEditor"
    :is="visuals.editor"
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
  >
    This component does not have an editor.
  </v-alert>
</template>

<script lang="ts">
import CompilerEditorBase from './CompilerEditorBase';

export default CompilerEditorBase().extend({
  computed: {
    hasEditor(): boolean {
      return Boolean(this.visuals && this.visuals.editor);
    },
  },
});
</script>