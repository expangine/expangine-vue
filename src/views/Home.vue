<template>
  <v-container>
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
import VisualsStarting from '../runtime/types/object';
import Registry from '../runtime';
import { TypeVisuals } from '../runtime/TypeVisuals';
import { defs } from 'expangine-runtime';


const Visuals: TypeVisuals<any, true, any> = VisualsStarting;
const { type, settings } = Visuals.onBuild();

function copy(a: any): any {
  return JSON.parse(JSON.stringify(a));
}

export default Vue.extend({
  name: 'home',
  mounted() {
    (window as any).registry = Registry;
    (window as any).home = this;

    this.loadType();
    this.loadData();
  },
  data: () => ({
    mode: 0,
    type,
    settings,
    registry: Registry,
    readOnly: false,
    data: copy(settings.defaultValue),
  }),
  computed: {
    isDesign(): boolean {
      return this.mode === 0 || this.mode === undefined;
    },
    isPopulate(): boolean {
      return this.mode === 1;
    },
  },
  methods: {
    reset() {
      const built = Visuals.onBuild();

      this.type = built.type;
      this.settings = built.settings;
      this.data = copy(built.settings.defaultValue);

      this.saveType();
      this.saveData();
    },
    saveType() {
      window.console.log('saving type & settings');

      localStorage.setItem('type', JSON.stringify(this.type.encode()));
      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    saveData() {
      window.console.log('saving data');

      localStorage.setItem('data', JSON.stringify(this.data));
    },
    loadType() {
      this.type = this.loadVar('type', this.type, (t) => defs.getType(t));
      this.settings = this.loadVar('settings', this.settings);
    },
    loadData() {
      this.data = this.loadVar('data', this.data);
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
