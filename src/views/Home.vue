<template>
  <v-container v-if="isReady">
    <v-row>
      <v-col>
        <v-toolbar height="64">
          <v-toolbar-items>
            <v-switch
              inset
              hide-details
              class="ma-2 pt-3"
              label="Read Only"
              v-model="readOnly"
            ></v-switch>
            <v-btn-toggle v-model="mode" class="ma-2">
              <v-btn text>
                Design
              </v-btn>
              <v-btn text>
                Populate
              </v-btn>
            </v-btn-toggle>
            <v-btn text @click="reset">
              Reset
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list v-if="isDesign">
          <ex-type-editor
            :type="type"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            @input:type="saveType"
            @input:settings="saveType"
          ></ex-type-editor>
        </v-list>
        <v-list v-if="isPopulate">
          <ex-type-input
            :value="data"
            :type="type"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            @input="saveData"
          ></ex-type-input>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, defs } from 'expangine-runtime';
import { TypeVisuals, TypeSettings } from '../runtime/TypeVisuals';
import VisualsStarting from '../runtime/types/object';
import Registry from '../runtime';
import { confirm } from '../app/Confirm';


const Visuals: TypeVisuals<any, true, any> = VisualsStarting;

function copy(a: any): any {
  return JSON.parse(JSON.stringify(a));
}

export default Vue.extend({
  name: 'home',
  async mounted() {
    (window as any).registry = Registry;
    (window as any).home = this;

    await this.loadType();
    this.loadData();
  },
  data: () => ({
    mode: 0,
    type: null as null | Type,
    settings: null as null | TypeSettings<any>,
    registry: Registry,
    readOnly: false,
    data: null as null | any,
  }),
  computed: {
    isReady(): boolean {
      return !!(this.type && this.settings);
    },
    isDesign(): boolean {
      return this.mode === 0 || this.mode === undefined;
    },
    isPopulate(): boolean {
      return this.mode === 1;
    },
  },
  methods: {
    async reset() {
      if (!await confirm()) {
        return;
      }

      const built = await Visuals.onBuild();

      this.type = built.type;
      this.settings = built.settings;
      this.data = copy(built.settings.defaultValue);

      this.saveType();
      this.saveData();
    },
    saveType() {
      if (this.type === null || this.settings === null) {
        return;
      }

      window.console.log('saving type & settings');

      localStorage.setItem('type', JSON.stringify(this.type.encode()));
      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    saveData() {
      if (this.data === null || this.type === null) {
        return;
      }

      window.console.log('saving data');

      localStorage.setItem('data', JSON.stringify(this.type.toJson(this.data)));
    },
    async loadType() {
      const defaults = await Visuals.onBuild();

      this.type = this.loadVar('type', defaults.type, (t) => defs.getType(t));
      this.settings = this.loadVar('settings', defaults.settings);
    },
    loadData() {
      if (this.settings === null || this.type === null) {
        return;
      }

      this.data = this.type.fromJson(this.loadVar('data', copy(this.settings.defaultValue)));
    },
    loadVar<V>(varName: string, defaultValue: V, mapper?: (value: any) => V): V {
      const stored = localStorage.getItem(varName);
      if (stored) {
        const parsed = JSON.parse(stored);  
        return mapper ? mapper(parsed) : parsed;
      }
      return defaultValue;
    },
  },
});
</script>
