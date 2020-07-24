<template>
  <ex-explorer-folder 
    show-count-on-close
    name="Data"
    :files-visible="filesVisible"
    :name-filter="nameFilter"
    :count="registry.defs.data.values.length">
    <template #files>
      <template v-for="data in registry.defs.data.values">
        <ex-explorer-data
          :key="data.name"
          :data="data"
          :registry="registry"
          :name-filter="nameFilter"
          :auto-open.sync="autoOpen"
          :show-count="showReferenceCounts"
          @open="open"
          @close="close"
        ></ex-explorer-data>
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
          <v-list-item @click="csv">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-file-delimited-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Import CSV
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="json">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-database-search</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Import Data from JS/JSON
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
import { isString, ReferenceData } from 'expangine-runtime';
import { ExplorerTab, isNameVisible } from './ExplorerTypes';
import { getInput } from '../Input';
import { sendNotification } from '../Notify';
import { getConfirmation } from '../Confirm';
import { getDataImport } from '../DataImport';
import { getDescribeData } from '../DescribeData';
import { Registry } from '../../runtime/Registry';
import { System } from '../SystemEvents';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedMapExport } from '../ProjectExport';
import { getNamedImport } from '../ProjectImport';
import { ExplorerSorter } from './ExplorerSorter';


const PREF_CLEAR_DATA = Preferences.define({
  key: 'clear_data',
  label: 'Clear data without confirmation',
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
      return this.registry.defs.data.keys.some((name) => isNameVisible(name, this.nameFilter));
    },
    sorter(): ExplorerSorter<ReferenceData> {
      const defs = this.registry.defs;

      return new ExplorerSorter(defs.data, {
        'Name': (a, b) => a.name.localeCompare(b.name),
        'Created': (a, b) => a.created - b.created,
        'Updated': (a, b) => a.updated - b.updated,
        'Reference Counts': (a, b) => defs.getDataReferences(a).length - defs.getDataReferences(b).length,
      });
    },
  },
  methods: {
    async add(opener: () => void) {
      const { registry: { defs } } = this;
      const name = await getInput({ title: 'Data Name'});

      if (!name || defs.getData(name)) {
        return await sendNotification({ message: 'Add Data canceled.' });
      }
      defs.addData({ name });

      opener();

      this.autoOpen = name;
    },
    async clear() {
      const { registry: { defs } } = this;

      if (await getConfirmation({ pref: PREF_CLEAR_DATA })) {
        defs.clearData();
      }
    },  
    async csv() {
      System.loadable(async () => {
        const { registry } = this;
        const { defs } = registry;
        const result = await getDataImport({ registry, returnOnly: true });

        if (isString(result)) {
          sendNotification({ message: result });
        } else {
          const name = result.filename || await getInput({ title: 'Data Name' });
          const imported = result.transform(0 as any);

          if (!name) {
            sendNotification({ message: 'Data Import CSV canceled.' });
          } else if (defs.getData(name)) {
            sendNotification({ message: 'Data already exists with that name.' });
          } else {
            defs.addData({
              name,
              data: imported.data,
              dataType: imported.type,
              meta: imported.settings,
            });
          }
        }
      });
    },
    async json() {
      System.loadable(async () => {
        const { registry } = this;
        const { defs } = registry;
        const result = await getDescribeData({ registry });

        if (result) {
          const name = await getInput({ title: 'Data Name' });

          if (!name) {
            sendNotification({ message: 'Data Import CSV canceled.' });
          } else if (defs.getData(name)) {
            sendNotification({ message: 'Data already exists with that name.' });
          } else {
            defs.addData({
              name,
              data: result.data,
              dataType: result.type,
              meta: result.settings,
            });
          }
        }
      });
    },
    async toJson() {
      await getNamedMapExport('data', this.registry.defs.data);
    },
    async fromJson() {
      System.loadable(async () => {
        await getNamedImport('data', this.registry.defs);
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