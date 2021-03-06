<template>
  <ex-explorer-folder 
    show-count-on-close
    name="Relations"
    :files-visible="filesVisible"
    :name-filter="nameFilter"
    :count="registry.defs.relations.values.length">
    <template #files>
      <template v-for="relation in registry.defs.relations.values">
        <ex-explorer-relation
          :key="relation.name"
          :relation="relation"
          :registry="registry"
          :name-filter="nameFilter"
          :auto-open.sync="autoOpen"
          @open="open"
          @close="close"
        ></ex-explorer-relation>
      </template>
    </template>
    <template #append="{ opener }">
      <v-menu offset-x>
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click.stop>
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="add(opener)">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-plus-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Add
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="toJson">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-export</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Export
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="fromJson">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-import</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Import
            </v-list-item-title>
          </v-list-item>
          <ex-explorer-sorter :sorter="sorter"></ex-explorer-sorter>
          <v-list-item @click="clear">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-delete</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Clear
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </ex-explorer-folder>
</template>


<script lang="ts">
import Vue from 'vue';
import { Relation } from 'expangine-runtime';
import { ExplorerTab, isNameVisible } from './ExplorerTypes';
import { getConfirmation } from '../Confirm';
import { getEditRelation } from '../EditRelation';
import { Registry } from '../../runtime/Registry';
import { System } from '../SystemEvents';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedMapExport } from '../ProjectExport';
import { getNamedImport } from '../ProjectImport';
import { ExplorerSorter } from './ExplorerSorter';


const PREF_CLEAR_RELATIONS = Preferences.define({
  key: 'clear_relations',
  label: 'Clear relations without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    nameFilter: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    autoOpen: null as null | string,
  }),
  computed: {
    filesVisible(): boolean {
      return this.registry.defs.relations.keys.some((name) => isNameVisible(name, this.nameFilter));
    },
    sorter(): ExplorerSorter<Relation> {
      const defs = this.registry.defs;

      return new ExplorerSorter(defs.relations, {
        Name: (a, b) => a.name.localeCompare(b.name),
        Created: (a, b) => a.created - b.created,
        Updated: (a, b) => a.updated - b.updated,
      });
    },
  },
  methods: {
    async add(opener: () => void) {
      const { registry } = this;
      const result = await getEditRelation({ registry });

      if (result) {
        opener();

        System.trigger('relationsChanged', registry.defs.relations);
      }

      this.autoOpen = name;
    },
    async clear() {
      const { registry: { defs } } = this;

      if (await getConfirmation({ pref: PREF_CLEAR_RELATIONS })) {
        defs.clearRelations();

        System.trigger('relationsChanged', defs.relations);
      }
    },
    async toJson() {
      await getNamedMapExport('relations', this.registry.defs.relations);
    },
    async fromJson() {
      System.loadable(async () => {
        await getNamedImport('relations', this.registry.defs);
      });
    },
    open(tab: ExplorerTab) {
      this.$emit('open', tab);
    },
    close(tab: ExplorerTab) {
      this.$emit('close', tab);
    },
  },
});
</script>