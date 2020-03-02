<template>
  <v-dialog v-model="visible" fullscreen scrollable>
    <ex-debug-program
      v-if="visible"
      :debug="debug"
      :registry="registry"
      @close="close"
    ></ex-debug-program>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { debugProgramDialog } from './DebugProgram';


export default Vue.extend({
  data: () => debugProgramDialog,
});
</script>