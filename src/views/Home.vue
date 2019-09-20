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
              color="primary"
              v-model="readOnly"
            ></v-switch>
            <v-btn-toggle v-model="mode" class="ma-2">
              <v-btn text>
                Design
              </v-btn>
              <v-btn text>
                Data
              </v-btn>
            </v-btn-toggle>
            <v-btn text @click="reset">
              Reset
            </v-btn>
            <v-btn text @click="exportJson">
              Export
            </v-btn>
            <v-btn text @click="importJson">
              Import
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
            @transform="transform"
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
import { Type, defs, Expression, isString } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import * as ex from 'expangine-runtime';
import { TypeVisuals, TypeSettings } from '../runtime/TypeVisuals';
import { TypeBuildResult } from '../runtime/TypeBuilder';
import { ObjectBuilder as DefaultBuilder } from '../runtime/types/object';
import Registry from '../runtime';
import { getConfirmation } from '../app/Confirm';
import { sendNotification } from '../app/Notify';



function copy(a: any): any {
  return JSON.parse(JSON.stringify(a));
}

export default Vue.extend({
  name: 'home',
  async mounted() {
    (window as any).registry = Registry;
    (window as any).runtime = LiveRuntime;
    (window as any).home = this;
    (window as any).ex = ex;

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
    async getDefaultTypes(): Promise<TypeBuildResult | false> {
      const builtOption = await DefaultBuilder.getOption({
        registry: this.registry,
      });

      return builtOption ? await builtOption.value() : false;
    },
    async reset() {
      if (!await getConfirmation()) {
        return;
      }

      const built = await this.getDefaultTypes();

      if (!built) {
        return;
      }

      this.type = built.type;
      this.settings = built.settings;
      this.data = built.type.fromJson(built.settings.defaultValue);

      this.saveType();
      this.saveData();
    },
    transform(expr: Expression) {
      if (expr instanceof Expression) {
        const cmd = LiveRuntime.getCommand(expr);

        cmd({ value: this.data });

        this.saveData();

        window.console.log(expr);
      }
    },
    exportJson() {
      if (!this.type) {
        return;
      }

      const exported = JSON.stringify({
        type: this.type.encode(),
        settings: this.settings,
        data: this.type.toJson(this.data),
      }, undefined, 2);

      this.downloadFile('export-' + Date.now() + '.json', exported, 'text/json');
    },
    importJson() {
      const finput = document.createElement('input');
      finput.type = 'file';
      finput.multiple = true;
      finput.accept = '.json';
      finput.onchange = (e) => finput.files && finput.files.length > 0 ? this.importFile(finput.files[0]) : undefined;
      finput.click();
      finput.remove();
    },
    importFile(file: File) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isString(reader.result)) {
          try {
            const parsed = JSON.parse(reader.result);

            this.importData(parsed);
          } catch (e) {
            sendNotification({ message: 'The file selected did not contain a valid JSON value.' });
          }
        } else {
          sendNotification({ message: 'The file selected was not a valid file.' });
        }
      };
      reader.readAsText(file);
    },
    importData(imported: any) {
      this.type = this.registry.defs.getType(imported.type);
      this.settings = imported.settings;
      this.data = this.type.fromJson(imported.data);
    },
    downloadFile(name: string, contents: any, type?: string) {
      const blob = new Blob([contents], {type: type || 'text/plain'});
      const href = window.URL.createObjectURL(blob);
      const dlink = document.createElement('a');
      dlink.download = name;
      dlink.href = href;
      dlink.onclick = (e) => setTimeout(() => window.URL.revokeObjectURL(dlink.href), 1500);
      dlink.click();
      dlink.remove();
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
      const defaults = await this.getDefaultTypes();

      if (!defaults) {
        return;
      }

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
