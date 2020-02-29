<template>
  <ex-explorer-file 
    icon="mdi-cube-outline"
    :name="entity.name"
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
          <v-list-item @click="duplicate">
            <v-list-item-avatar class="mr-3">
              <v-icon>mdi-alpha-e-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Copy Expression
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
import { Program, Entity, Exprs } from 'expangine-runtime';
import { ExplorerTab } from './ExplorerTypes';
import { Registry } from '@/runtime/Registry';
import { getInput } from '@/app/Input';
import { sendNotification } from '@/app/Notify';
import { getConfirmation } from '@/app/Confirm';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedExport } from '../ProjectExport';


const PREF_REMOVE_ENTITY = Preferences.define({
  key: 'remove_entity',
  label: 'Remove Type without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    entity: {
      type: Object as () => Entity,
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
  methods: {
    async renamed(name: string) {
      const { entity, registry: { defs } } = this;

      defs.renameEntity(entity, name);
    },
    async duplicate() {
      const { entity, registry: { defs } } = this;
      const name = await getInput({ title: 'Duplicate Name', value: entity.name });

      if (name && !defs.getEntity(name)) {
        defs.addEntity({
          ...entity.encode(),
          name,
        });
      } else if (name) {
        sendNotification({ message: 'A Type with that name already exists.' });
      } else {
        sendNotification({ message: 'Duplicate Type canceled.' });
      }
    },
    async clipboad() {
      this.registry.copy(Exprs.entity(this.entity.name));

      sendNotification({ message: 'Expression copied to clipboard to reference this Type.' });
    },
    async remove() {
      const { entity, registry: { defs } } = this;
      const refs = defs.getEntityReferences(entity).length;
      const message = refs > 0
        ? `${entity.name} is referenced ${refs} time(s), removing it will break everything referencing it.`
        : `Are you sure you want to remove ${entity.name}?`;

      if (await getConfirmation({ message, pref: PREF_REMOVE_ENTITY })) {
        defs.removeEntity(entity, false, true);
      }
    },
    async toJson() {
      await getNamedExport('entities', this.entity);
    },
    open(tab: ExplorerTab) {
      this.tab = tab;

      if (!tab.component) {
        const { entity, registry } = this;

        tab.component = 'ex-edit-entity';
        tab.bind = {
          hideName: true,
          entity,
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