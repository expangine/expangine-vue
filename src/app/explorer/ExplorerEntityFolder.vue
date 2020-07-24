<template>
  <ex-explorer-folder 
    show-count-on-close
    name="Types"
    :files-visible="filesVisible"
    :name-filter="nameFilter"
    :count="registry.defs.entities.values.length">
    <template #files>
      <template v-for="entity in registry.defs.entities.values">
        <ex-explorer-entity
          :key="entity.name"
          :entity="entity"
          :registry="registry"
          :name-filter="nameFilter"
          :auto-open.sync="autoOpen"
          :show-count="showReferenceCounts"
          @open="open"
          @close="close"
        ></ex-explorer-entity>
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
          <v-list-item @click="toggleReferenceCounts">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-swap-horizontal-bold</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              {{ showReferenceCounts ? 'Hide' : 'Show' }} Reference Counts
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
import { Entity } from 'expangine-runtime';
import { ExplorerTab, isNameVisible } from './ExplorerTypes';
import { getInput } from '../Input';
import { sendNotification } from '../Notify';
import { getConfirmation } from '../Confirm';
import { Registry } from '../../runtime/Registry';
import { System } from '../SystemEvents';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedMapExport } from '../ProjectExport';
import { getNamedImport } from '../ProjectImport';
import { ExplorerSorter } from './ExplorerSorter';


const PREF_CLEAR_TYPES = Preferences.define({
  key: 'clear_types',
  label: 'Clear types without confirmation',
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
    showReferenceCounts: false,
  }),
  computed: {
    filesVisible(): boolean {
      return this.registry.defs.entities.keys.some((name) => isNameVisible(name, this.nameFilter));
    },
    sorter(): ExplorerSorter<Entity> {
      const defs = this.registry.defs;

      return new ExplorerSorter(defs.entities, {
        'Name': (a, b) => a.name.localeCompare(b.name),
        'Created': (a, b) => a.created - b.created,
        'Updated': (a, b) => a.updated - b.updated,
        'Reference Counts': (a, b) => defs.getEntityReferences(a).length - defs.getEntityReferences(b).length,
      });
    },
  },
  methods: {
    async add(opener: () => void) {
      const { registry: { defs } } = this;
      const name = await getInput({ title: 'Type Name'});

      if (!name || defs.getEntity(name)) {
        return await sendNotification({ message: 'Add Type canceled.' });
      }
      defs.addEntity({ name });

      opener();

      this.autoOpen = name;
    },
    async clear() {
      const { registry: { defs } } = this;

      if (await getConfirmation({ pref: PREF_CLEAR_TYPES })) {
        defs.clearEntities();
      }
    },
    async toJson() {
      await getNamedMapExport('entities', this.registry.defs.entities);
    },
    async fromJson() {
      System.loadable(async () => {
        await getNamedImport('entities', this.registry.defs);
      });
    },
    open(tab: ExplorerTab) {
      this.$emit('open', tab);
    },
    close(tab: ExplorerTab) {
      this.$emit('close', tab);
    },
    toggleReferenceCounts() {
      this.showReferenceCounts = !this.showReferenceCounts;
    },
  },
});
</script>