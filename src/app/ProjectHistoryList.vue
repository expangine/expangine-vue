<template>
  <v-list dense subheader>
    <template v-for="(state, index) in redos">
      <v-list-item :key="`redo${index}`" @click="gotoRedo(index)">
        <v-list-item-content>
          <v-list-item-title>
            {{ history.getStateDetails(state) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="state.$meta.at">
            <timeago :datetime="state.$meta.at"></timeago>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-divider></v-divider>
    <v-subheader>Current State</v-subheader>
    <v-divider></v-divider>
    <template v-for="(state, index) in undos">
      <v-list-item :key="`undo${index}`" @click="gotoUndo(index)">
        <v-list-item-content>
          <v-list-item-title>
            {{ history.getStateDetails(state) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="state.$meta.at">
            <timeago :datetime="state.$meta.at"></timeago>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>  
</template>

<script lang="ts">
import Vue from 'vue';
// import { ProjectHistory, ProjectState } from './ProjectHistory';


export default Vue.extend({
  props: {
    history: {
      type: Object, // as () => ProjectHistory,
      required: true,
    },
  },
  data: () => ({
    undos: [], // as ProjectState[],
    redos: [], // as ProjectState[],
  }),
  mounted() {
    this.updateLists();
    this.history.on('change', this.updateLists);
  },
  methods: {
    updateLists(): void {
      this.redos = this.history.redos;
      this.undos = this.history.undos.slice().reverse();
    },
    gotoRedo(index: number) {
      this.history.goto(index - this.history.redos.length);
    },
    gotoUndo(index: number) {
      this.history.goto(index + 1);
    },
  },
});
</script>