<template>
  <v-dialog persistent v-model="visible" max-width="600" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">

        {{ title }}
      </v-card-title>
      <v-card-text>
        <ex-edit-relation
          :registry="registry"
          :relation="relation"
          @remove="removed"
          @create="setRelation"
        ></ex-edit-relation>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="buttonText" 
          @click="finish"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Relation } from 'expangine-runtime';
import { editRelationDialog } from './EditRelation';


export default Vue.extend({
  data: () => editRelationDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    title(): string {
      return this.name ? 'Edit Relation' : 'Add Relation';
    },
    isSaved(): boolean {
      return !!this.relation && this.registry.defs.getRelation(this.relation.name) === this.relation;
    },
    buttonText(): string {
      return this.isSaved ? this.confirm : this.unconfirm;
    },
  },
  methods: {
    finish() {
      this.done(this.isSaved);
    },
    removed() {
      this.done(false);
    },
    setRelation(relation: Relation) {
      this.relation = relation;
    },
  },
});
</script>
