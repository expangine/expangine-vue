<template>
  <v-dialog v-model="visible" max-width="1000">
    <v-card v-if="visible">
      <v-card-title class="headline">
        {{ title }}
        <v-chip 
          v-if="name" 
          label 
          class="ml-3"
        >{{ name }}</v-chip>
      </v-card-title>
      <v-card-text>
        <ex-type-input
          :registry="registry"
          :value="data"
          :type="params"
          :settings="settings"
        ></ex-type-input>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          @click="close">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary"
          @click="test">
          <v-icon>mdi-play</v-icon>
          Test
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { testFunctionDialog } from './TestFunction';
import { getRunProgram } from './RunProgram';


export default Vue.extend({
  data: () => testFunctionDialog,
  methods: {
    test() {
      getRunProgram({
        registry: this.registry,
        type: this.params,
        program: this.func.options.expression,
        data: this.data,
      });
    },
  },
});
</script>