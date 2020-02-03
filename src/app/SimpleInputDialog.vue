<template>
  <v-dialog v-model="visible" max-width="500" :persistent="persistent">
    <v-card>
      <v-card-title 
        class="headline" 
        v-html="title"
      ></v-card-title>
      <v-card-text 
        v-if="message"
        v-html="message"
      ></v-card-text>
      <v-card-text v-focus-on-visible="[visible, 'input, textarea, select']">
        <ex-simple-fields
          :value="value"
          :fields="fields"
        ></ex-simple-fields>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="secondary"
          v-html="unconfirm" 
          @click="handle(false)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary"
          v-html="confirm" 
          @click="handle(true)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { simpleInputDialog } from './SimpleInput';


export default Vue.extend({
  data: () => simpleInputDialog,
});
</script>