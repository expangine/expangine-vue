<template>
  <ex-explorer-file 
    icon="mdi-function"
    :name="func.name"
    :name-filter="nameFilter"
    :auto-open="autoOpen"
    :count="referenceCount"
    :show-count="showCount"
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
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Duplicate
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="duplicate">
            <v-list-item-avatar class="mr-3 my-0">
              <v-icon>mdi-alpha-e-circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              Copy Expression
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
          <v-list-item @click="remove">
            <v-list-item-avatar class="mr-3 my-0">
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
import { Func, Exprs } from 'expangine-runtime';
import { ExplorerTab } from './ExplorerTypes';
import { Registry } from '../../runtime/Registry';
import { getInput } from '../Input';
import { sendNotification } from '../Notify';
import { getConfirmation } from '../Confirm';
import { Preferences, PreferenceCategory } from '../Preference';
import { getNamedExport } from '../ProjectExport';


const PREF_REMOVE_FUNCTION = Preferences.define({
  key: 'remove_function',
  label: 'Remove function without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    func: {
      type: Object as () => Func,
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
    showCount: {
      type: [Number, Boolean],
      default: false,
    },
  },
  data: () => ({
    tab: null as null | ExplorerTab,
  }),
  computed: {
    referenceCount(): string {
      return this.showCount ? this.registry.defs.getFunctionReferences(this.func).length.toFixed() : '-';
    },
  },
  watch: {
    func(func: Func) {
      if (this.tab) {
        this.tab.bind.func = func;
      }
    },
  },
  methods: {
    async renamed(name: string) {
      const { func, registry: { defs } } = this;

      defs.renameFunction(func, name);
    },
    async duplicate() {
      const { func, registry: { defs } } = this;
      const name = await getInput({ title: 'Duplicate Name', value: func.name });

      if (name && !defs.getFunction(name)) {
        defs.addFunction({
          ...func.encode(),
          name,
        });
      } else if (name) {
        sendNotification({ message: 'A Function with that name already exists.' });
      } else {
        sendNotification({ message: 'Duplicate Function canceled.' });
      }
    },
    async clipboad() {
      this.registry.copy(Exprs.invoke(this.func.name));

      sendNotification({ message: 'Expression copied to clipboard to invoke this Function.' });
    },
    async remove() {
      const { func, registry: { defs } } = this;
      const refs = defs.getFunctionReferences(func).length;
      const message = refs > 0
        ? `${func.name} is referenced ${refs} time(s), removing it will break everything referencing it.`
        : `Are you sure you want to remove ${func.name}?`;

      if (await getConfirmation({ message, pref: PREF_REMOVE_FUNCTION })) {
        defs.removeFunction(func, false, true);
      }
    },
    async toJson() {
      await getNamedExport('functions', this.func);
    },
    open(tab: ExplorerTab) {
      this.tab = tab;
      
      if (!tab.component) {
        const { func, registry } = this;

        tab.component = 'ex-edit-function';
        tab.bind = {
          hideName: true,
          func,
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