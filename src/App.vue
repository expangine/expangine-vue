<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        Expangine
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text target="_blank" href="https://github.com/expangine/expangine-vue">
        <span class="mr-2">GitHub</span>
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view></router-view>

      <confirm-dialog></confirm-dialog>
      <input-dialog></input-dialog>
      <notify-dialog></notify-dialog>
      <build-type-dialog></build-type-dialog>
      <run-program-dialog></run-program-dialog>
      <debug-program-dialog></debug-program-dialog>
      <describe-data-dialog></describe-data-dialog>
      <edit-function-dialog></edit-function-dialog>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import ConfirmDialog from './app/ConfirmDialog.vue';
import InputDialog from './app/InputDialog.vue';
import BuildTypeDialog from './app/BuildTypeDialog.vue';
import NotifyDialog from './app/NotifyDialog.vue';
import RunProgramDialog from './app/RunProgramDialog.vue';
import DebugProgramDialog from './app/DebugProgramDialog.vue';
import DescribeDataDialog from './app/DescribeDataDialog.vue';
import EditFunctionDialog from './app/EditFunctionDialog.vue';


export default Vue.extend({
  name: 'App',
  components: { 
    ConfirmDialog,
    BuildTypeDialog,
    InputDialog,
    NotifyDialog,
    RunProgramDialog,
    DebugProgramDialog,
    DescribeDataDialog,
    EditFunctionDialog,
  },
});
</script>
