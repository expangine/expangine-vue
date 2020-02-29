<template>
  <v-dialog persistent v-model="data.visible" max-width="300">
    <ex-build-type
      v-if="data.visible"
      v-bind="data"
      @ok="data.handle"
      @cancel="data.handle"
    ></ex-build-type>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { buildTypeDialog } from './BuildType';


export default Vue.extend({
  data: () => ({
    data: buildTypeDialog,
  }),
});
</script>