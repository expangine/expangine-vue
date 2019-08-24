<template>
  <v-snackbar vertical v-model="visible">
    <span v-html="message"></span>
    <v-btn text color="primary" @click="handle(true)">
      {{ action }}
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { notifyDialog } from './Notify';


export default Vue.extend({
  data: () => notifyDialog,
  watch: {
    visible(value) {
      if (!value) {
        this.handle(false);
      }
    },
  },
});
</script>