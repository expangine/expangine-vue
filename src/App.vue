<template>
  <v-app>
    <router-view />

    <ex-input-dialog></ex-input-dialog>
    <ex-notify-dialog></ex-notify-dialog>
    <ex-confirm-dialog></ex-confirm-dialog>
    <ex-build-type-dialog></ex-build-type-dialog>
    <ex-run-program-dialog></ex-run-program-dialog>
    <ex-simple-input-dialog></ex-simple-input-dialog>
    <ex-debug-program-dialog></ex-debug-program-dialog>
    <ex-describe-data-dialog></ex-describe-data-dialog>
    <ex-display-data-dialog></ex-display-data-dialog>
    <ex-edit-function-dialog></ex-edit-function-dialog>
    <ex-edit-method-dialog></ex-edit-method-dialog>
    <ex-test-function-dialog></ex-test-function-dialog>
    <ex-test-operation-dialog></ex-test-operation-dialog>
    <ex-test-program-dialog></ex-test-program-dialog>
    <ex-get-program-dialog></ex-get-program-dialog>
    <ex-value-dialog></ex-value-dialog>
    <ex-edit-entity-index-dialog></ex-edit-entity-index-dialog>
    <ex-edit-entity-transcoder-dialog></ex-edit-entity-transcoder-dialog>
    <ex-edit-entity-dialog></ex-edit-entity-dialog>
    <ex-edit-relation-dialog></ex-edit-relation-dialog>
    <ex-func-test-dialog></ex-func-test-dialog>
    
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import * as ex from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { Preferences } from './app/Preference';
import { Shortcuts } from './app/Shortcuts';
import Registry from './runtime';



export default Vue.extend({
  name: 'App',
  async mounted() {
    (window as any).registry = Registry;
    (window as any).runtime = LiveRuntime;
    (window as any).home = this;
    (window as any).ex = ex;
    (window as any).Shortcuts = Shortcuts;
    (window as any).Preference = Preferences;

    LiveRuntime.objectSet = (target, key, value) => {
      Vue.set(target as any, key as string, value);
    };
    LiveRuntime.objectRemove = (target, key) => {
      Vue.delete(target as any, key as string);
    };
    LiveRuntime.arraySet = (arr, index, item) => {
      const existing = arr[index];
      Vue.set(arr, index, item);
      return existing;
    };
    LiveRuntime.arrayRemoveAt = (arr, index) => {
      const existing = arr[index];
      Vue.delete(arr, index);
      return existing;
    };
  },
});
</script>