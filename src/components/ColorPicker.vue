<template>
  <v-menu 
    offset-x
    max-width="300"
    :disabled="readOnly"
    :close-on-content-click="false" 
  >
    <template #activator="{ on }">
      <v-text-field
        v-bind="$props"
        v-on="on"
        append-icon="mdi-close"
        :value="value"
        @input="input"
        @click:clear="$emit('click:clear')"
      ></v-text-field>
    </template>
    <v-color-picker
      v-bind="$props"
      :value="value"
      @input="input"
    ></v-color-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    filled: {
      type: Boolean,
    },
    clearable: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    hint: {
      type: String,
    },
    showSwatches: {
      type: Boolean,
    },
    hideDetails: {
      type: Boolean,
    },
    persistentHint: {
      type: Boolean,
    },
  },
  methods: {
    input(value: string) {
      this.$emit('input', value);
    },
  },
});
</script>

<style scoped>

</style>