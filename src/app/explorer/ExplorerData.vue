<template>
  <ex-explorer-file 
    icon="mdi-database"
    :name="data.name"
    :name-filter="nameFilter"
    :auto-open="autoOpen"
    @update:auto-open="updateAutoOpen"
    @rename="renamed"
    @open="open"
    @close="close">
    <template #append>
      <v-menu offset-x>
        <template #activator="{ on }">
          <v-btn icon v-on="on" @click.stop>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="duplicate">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Duplicate
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="toJson">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-export</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Export
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="remove">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-delete</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Remove
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </ex-explorer-file>
</template>


<script lang="ts">
import Vue from 'vue';
import { Program, Entity, ReferenceData } from 'expangine-runtime';
import { ExplorerTab } from './ExplorerTypes';
import { Registry } from '@/runtime/Registry';
import { getInput } from '@/app/Input';
import { sendNotification } from '@/app/Notify';
import { getConfirmation } from '@/app/Confirm';
import { exportFile } from '@/app/FileExport';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedExport } from '../ProjectExport';


const PREF_REMOVE_DATA = Preferences.define({
  key: 'remove_data',
  label: 'Remove data without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    data: {
      type: Object as () => ReferenceData,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    nameFilter: {
      type: String,
      default: '',
    },
    autoOpen: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    tab: null as null | ExplorerTab,
  }),
  watch: {
    data(data: ReferenceData) {
      if (this.tab) {
        this.tab.bind.data = data;
      }
    },
  },
  methods: {
    async renamed(name: string) {
      const { data, registry: { defs } } = this;

      defs.renameData(data, name);
    },
    async duplicate() {
      const { data, registry: { defs } } = this;
      const name = await getInput({ title: 'Duplicate Name', value: data.name });

      if (name && !defs.getData(name)) {
        defs.addProgram({
          ...data.encode(),
          name,
        });
      } else if (name) {
        sendNotification({ message: 'Data with that name already exists.' });
      } else {
        sendNotification({ message: 'Duplicate Data canceled.' });
      }
    },
    async remove() {
      const { data, registry: { defs } } = this;
      const refs = defs.getDataReferences(data).length;
      const message = refs > 0
        ? `${data.name} is referenced ${refs} time(s), removing it will break everything referencing it.`
        : `Are you sure you want to remove ${data.name}?`;

      if (await getConfirmation({ message, pref: PREF_REMOVE_DATA })) {
        defs.removeData(data, false, true);
      }
    },
    async toJson() {
      await getNamedExport('data', this.data);
    },
    open(tab: ExplorerTab) {
      this.tab = tab;
      
      if (!tab.component) {
        const { data, registry } = this;

        tab.component = 'ex-edit-data';
        tab.bind = {
          hideName: true,
          data,
          registry,
        };
      }
      
      this.$emit('open', tab);
    },
    close(tab: ExplorerTab) {
      this.$emit('close', tab);
    },
    updateAutoOpen(autoOpen: string | null) {
      this.$emit('update:auto-open', autoOpen);
    },
  },
});
</script>