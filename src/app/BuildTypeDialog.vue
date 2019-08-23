<template>
  <v-dialog v-model="visible" max-width="300">
    <v-card>
      <v-card-title 
        class="headline" 
        v-html="title"
      ></v-card-title>
      <v-card-text>
        <v-select
          solo
          filled
          hide-details
          placeholder="- Select Type -"
          :items="items"
          v-model="type"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          v-html="ok" 
          @click="handle(true)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="cancel" 
          @click="handle(false)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { buildTypeDialog } from './BuildType';
import { ListOptions } from '../common';
import { TypeVisuals } from '../runtime/TypeVisuals';


export default Vue.extend({
  data: () => buildTypeDialog,
  computed: {
    items(): ListOptions<TypeVisuals | null> {
      return this.registry.getBuildableTypeOptions(this.exclude);
    },
  },
});
</script>