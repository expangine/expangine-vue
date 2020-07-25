<template>
  <ex-explorer-folder 
    show-count-on-close
    name="Programs"
    :files-visible="filesVisible"
    :name-filter="nameFilter"
    :count="registry.defs.programs.values.length">
    <template #files>
      <template v-for="program in registry.defs.programs.values">
        <ex-explorer-program
          :key="program.name"
          :program="program"
          :registry="registry"
          :name-filter="nameFilter"
          :auto-open.sync="autoOpen"
          @open="open"
          @close="close"
        ></ex-explorer-program>
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
import { Program } from 'expangine-runtime';
import { ExplorerTab, isNameVisible } from './ExplorerTypes';
import { getInput } from '../Input';
import { sendNotification } from '../Notify';
import { getConfirmation } from '../Confirm';
import { Registry } from '../../runtime/Registry';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedMapExport } from '../ProjectExport';
import { System } from '../SystemEvents';
import { getNamedImport } from '../ProjectImport';
import { ExplorerSorter } from './ExplorerSorter';


const PREF_CLEAR_PROGRAMS = Preferences.define({
  key: 'clear_programs',
  label: 'Clear programs without confirmation',
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
      return this.registry.defs.programs.keys.some((name) => isNameVisible(name, this.nameFilter));
    },
    sorter(): ExplorerSorter<Program> {
      const defs = this.registry.defs;

      return new ExplorerSorter(defs.programs, {
        Name: (a, b) => a.name.localeCompare(b.name),
        Created: (a, b) => a.created - b.created,
        Updated: (a, b) => a.updated - b.updated,
      });
    },
  },
  methods: {
    async add(opener: () => void) {
      const { registry: { defs } } = this;
      const name = await getInput({ title: 'Program Name'});

      if (!name || defs.getProgram(name)) {
        return await sendNotification({ message: 'Add Program Canceled' });
      }
      defs.addProgram({ name });

      opener();

      this.autoOpen = name;
    },
    async clear() {
      const { registry: { defs } } = this;

      if (await getConfirmation({ pref: PREF_CLEAR_PROGRAMS })) {
        defs.clearPrograms();
      }
    },  
    async toJson() {
      await getNamedMapExport('programs', this.registry.defs.programs);
    },
    async fromJson() {
      System.loadable(async () => {
        await getNamedImport('programs', this.registry.defs);
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