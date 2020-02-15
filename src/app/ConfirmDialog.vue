<template>
  <v-dialog persistent v-model="visible" max-width="500">
    <v-card>
      <v-card-title 
        class="headline" 
        v-html="title"
      ></v-card-title>
      <v-card-text 
        v-html="message"
      ></v-card-text>
      <v-card-text v-if="pref">
        <v-switch
          persistent-hint
          label="Don't ask again"
          :hint="dontShowHint"
          v-model="dontShow"
        ></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          v-if="confirm"
          color="primary"
          v-html="confirm" 
          v-focus-on-visible="[visible, 'self']"
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
import { confirmDialog } from './Confirm';
import { Preferences } from './Preference';


export default Vue.extend({
  data: () => confirmDialog,
  computed: {
    dontShow: {
      get(): boolean {
        return this.pref ? Preferences.get(this.pref, false) : false;
      },
      set(value: boolean) { 
        if (this.pref) {
          Preferences.set(this.pref, value);
        }
      },
    },
    dontShowHint(): string {
      if (!this.pref) {
        return '';
      }

      return Preferences.getPreference(this.pref).label;
    },
  },
});
</script>