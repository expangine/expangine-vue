<template>
  <ex-explorer-file 
    icon="mdi-axis-arrow"
    :name="relation.name"
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
import { Program, Entity, Exprs, Relation } from 'expangine-runtime';
import { ExplorerTab } from './ExplorerTypes';
import { Registry } from '@/runtime/Registry';
import { getInput } from '@/app/Input';
import { sendNotification } from '@/app/Notify';
import { getConfirmation } from '@/app/Confirm';
import { Preferences, PreferenceCategory } from '../Preference';
import { getEditRelation } from '../EditRelation';
import { getNamedExport } from '../ProjectExport';


const PREF_REMOVE_RELATION = Preferences.define({
  key: 'remove_relation',
  label: 'Remove Relation without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    relation: {
      type: Object as () => Relation,
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
    relation(relation: Relation) {
      if (this.tab) {
        this.tab.bind.relation = relation;
      }
    },
  },
  methods: {
    async renamed(name: string) {
      const { relation, registry: { defs } } = this;

      defs.renameRelation(relation, name);
    },
    async duplicate() {
      const { relation, registry: { defs } } = this;
      const name = await getInput({ title: 'Duplicate Name', value: relation.name });

      if (name && !defs.getRelation(name)) {
        defs.addRelation({
          ...relation.encode(),
          name,
        });
      } else if (name) {
        sendNotification({ message: 'A Relation with that name already exists.' });
      } else {
        sendNotification({ message: 'Duplicate Relation canceled.' });
      }
    },
    async clipboad() {
      this.registry.copy(Exprs.relation(this.relation.name));

      sendNotification({ message: 'Expression copied to clipboard to reference this Relation.' });
    },
    async remove() {
      const { relation, registry: { defs } } = this;
      const refs = defs.getRelationReferences(relation).length;
      const message = refs > 0
        ? `${relation.name} is referenced ${refs} time(s), removing it will break everything referencing it.`
        : `Are you sure you want to remove ${relation.name}?`;

      if (await getConfirmation({ message, pref: PREF_REMOVE_RELATION })) {
        defs.removeRelation(relation, false, true);
      }
    },
    async toJson() {
      await getNamedExport('relations', this.relation);
    },
    open(tab: ExplorerTab) {
      this.tab = tab;

      if (!tab.component) {
        const { relation, registry } = this;

        tab.component = 'ex-edit-relation';
        tab.bind = {
          hideName: true,
          relation,
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