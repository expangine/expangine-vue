<template>
  <v-text-field
    outlined
    hide-details
    class="ma-2"
    label="Content"
    v-model="text"
  ></v-text-field>
</template>s

<script lang="ts">
import NodeEditorBase from '../NodeEditorBase';


export default NodeEditorBase<string>().extend({
  computed: {
    text: {
      get(): string {
        return this.value;
      },
      set(text: string) {
        this.input(text);
      },
    },
  },
});
</script>