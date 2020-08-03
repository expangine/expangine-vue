<template>
  <v-dialog persistent v-model="visible" max-width="300">
    <v-card>
      <v-card-title 
        class="headline" 
        v-html="title"
      ></v-card-title>
      <v-card-text 
        v-html="message"
      ></v-card-text>
      <v-card-text>
        <v-text-field
          outlined
          :error="error"
          :label="label"
          v-focus-on-visible="[visible, 'input']"
          v-model="value"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          :disabled="error"
          v-html="confirm" 
          @click="handle(true)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="unconfirm" 
          @click="handle(false)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { inputDialog } from './Input';


export default Vue.extend({
  data: () => inputDialog,
  computed: {
    error(): boolean {
      return this.matches && !this.matches.test(this.value);
    },
  },
});
</script>