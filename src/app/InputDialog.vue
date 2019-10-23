<template>
  <v-dialog v-model="visible" max-width="300">
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
          :label="label"
          v-model="value"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
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
});
</script>