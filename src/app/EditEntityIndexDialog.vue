<template>
  <v-dialog persistent v-model="visible" max-width="500" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <ex-edit-entity-index
          :entity="entity"
          :index="index"
          :registry="registry"
          :props-only="propsOnly"
          @removed="handle(false)"
        ></ex-edit-entity-index>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="buttonText" 
          @click="handle(true)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ObjectType, Types, objectEach, objectToArray } from 'expangine-runtime';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { editTypeIndexDialog } from './EditEntityIndex';
import { getConfirmation } from './Confirm';
import { Preferences, PreferenceCategory } from './Preference';


const PREF_REMOVE_TYPE_INDEX = Preferences.define({
  key: 'remove_type_index',
  label: 'Remove user-defined type indexes without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default Vue.extend({
  data: () => editTypeIndexDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    title(): string {
      return this.name ? 'Edit Index' : 'Add Index';
    },
    invalidName(): boolean {
      if (!this.index.name) {
        return true;
      }
      if (!this.entity) {
        return false;
      }
      const existing = this.entity.indexes[this.index.name];
      if (existing && existing !== this.index) {
        return true;
      }
      const primary = this.entity.getPrimary();
      if (primary && primary !== this.index && primary.name === this.index.name) {
        return true;
      }
      return false;
    },
    disableSave(): boolean {
      return this.invalidName || this.index.props.length === 0;
    },
    isSaved(): boolean {
      return this.entity.indexes[this.index.name] === this.index;
    },
    buttonText(): string {
      return this.isSaved ? this.confirm : this.unconfirm;
    },
  },
});
</script>