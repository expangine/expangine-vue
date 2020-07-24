<template>
  <v-menu offset-x v-if="sorter.isSortable()">
    <template #activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-avatar class="mr-3 my-0">
          <v-icon>mdi-sort-descending</v-icon>
        </v-list-item-avatar>
        <v-list-item-title>
          Sort
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-list dense>
      <template v-for="prop in sorter.labels">
        <v-list-item :key="prop" @click="sorter.sortBy(prop)">
          <v-list-item-avatar class="mr-3 my-0">
            <v-icon>{{ sorter.getSortIcon(prop) }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-title>
            {{ prop }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { ExplorerSorter } from './ExplorerSorter';

export default Vue.extend({
  props: {
    sorter: {
      type: Object as () => ExplorerSorter<any>,
    },
  },
});
</script>