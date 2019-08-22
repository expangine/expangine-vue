<template>
  <v-menu :close-on-content-click="false" max-width="300" offset-x>
    <template #activator="{ on }">
      <v-text-field
        v-bind="$props"
        v-on="on"
        append-icon="mdi-close"
        :value="value"
        @input="input"
        @click:append.prevent="clear"
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
  props: ['value', 'filled', 'label', 'showSwatches', 'hideDetails'],
  methods: {
    input(value: string) {
      this.$emit('input', value);
    },
    clear() {
      this.input('');
    },
  },
});
</script>

<style scoped>

</style>