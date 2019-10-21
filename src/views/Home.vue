<template>
  <v-container v-if="isReady">
    <v-row>
      <v-col>
        <v-toolbar height="64">
          <v-toolbar-items>
            <v-menu offset-y>
              <template #activator="{ on }">
                <v-btn text v-on="on">
                  File
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="exportJson">
                  <v-list-item-icon>
                    <v-icon>mdi-export</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Export</v-list-item-title>
                    <v-list-item-subtitle>Download the type, data, and program as a JSON file.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="importJson">
                  <v-list-item-icon>
                    <v-icon>mdi-import</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Import</v-list-item-title>
                    <v-list-item-subtitle>Upload a JSON file with a type, data, and program.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="describe">
                  <v-list-item-icon>
                    <v-icon>mdi-database-search</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Detect</v-list-item-title>
                    <v-list-item-subtitle>Set the type &amp; data based on JSON or JS code.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="reset">
                  <v-list-item-icon>
                    <v-icon>mdi-refresh</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Reset</v-list-item-title>
                    <v-list-item-subtitle>Clears the designed type, data, and program.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu offset-y :close-on-content-click="false">
              <template #activator="{ on }">
                <v-btn text v-on="on">
                  Edit
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="historyUndo" :disabled="undos.length === 0">
                  <v-list-item-icon>
                    <v-icon>mdi-undo</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Undo</v-list-item-title>
                    <v-list-item-subtitle>Undo the last change.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="historyRedo" :disabled="redos.length === 0">
                  <v-list-item-icon>
                    <v-icon>mdi-redo</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Redo</v-list-item-title>
                    <v-list-item-subtitle>Redo the last undone change.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu offset-y>
              <template #activator="{ on }">
                <v-btn text v-on="on">
                  Functions
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item key="new" @click="addFunction">
                  <v-list-item-content>
                    <v-list-item-title>Add</v-list-item-title>
                    <v-list-item-subtitle>Create a new re-usable function.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <template v-for="(func, name) in registry.defs.functions">
                  <v-list-item :key="name" @click="editFunction(name)">
                    <v-list-item-content>
                      <v-list-item-title>{{ name }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-divider></v-divider>
                <v-list-item key="clear" @click="clearFunctions">
                  <v-list-item-content>
                    <v-list-item-title>Clear</v-list-item-title>
                    <v-list-item-subtitle>Remove all user-defined functions.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn-toggle
              mandatory
              class="mt-2 mr-4 ml-2"
              v-model="mode"
              @change="saveDataPending">
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-file-tree</v-icon>
                  </v-btn>
                </template>
                <span>The structure of the data.</span>
              </v-tooltip>
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-database-edit</v-icon>
                  </v-btn>
                </template>
                <span>The data.</span>
              </v-tooltip>
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-code-braces</v-icon>
                  </v-btn>
                </template>
                <span>A program to process the data and produce a result.</span>
              </v-tooltip>
            </v-btn-toggle>
            <v-spacer></v-spacer>
            <v-switch
              inset
              hide-details
              class="ma-2 pt-3"
              label="Read Only"
              color="primary"
              v-model="readOnly"
            ></v-switch>
            <v-btn text @click="runProgram">
              <v-icon>mdi-play</v-icon>
              Run
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
            @change="handleChange"
          ></ex-type-editor>
        </v-list>
        <v-list v-if="isPopulate">
          <ex-type-input
            :value="data"
            :type="type"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            @input="saveDataDebounce"
          ></ex-type-input>
        </v-list>
        <v-list v-if="isProgram">
          <ex-expression
            can-remove
            type="body"
            :value="program"
            :context="type"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            :show-complexity="showComplexity"
            @remove="resetProgram"
            @input="saveProgram"
          ></ex-expression>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import * as ex from 'expangine-runtime';
import { Type, defs, Expression, isString, isObject, NoExpression, objectMap, FunctionType } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import Registry from '../runtime';
import { TypeVisuals, TypeSettings, TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { ObjectBuilder as DefaultBuilder } from '../runtime/types/object';
import { getConfirmation } from '../app/Confirm';
import { sendNotification } from '../app/Notify';
import { getRunProgram } from '../app/RunProgram';
import { getDescribeData } from '../app/DescribeData';
import { getEditFunction } from '../app/EditFunction';
import { getInput } from '../app/Input';
import { friendlyList } from '@/common';



function copy(a: any): any {
  return JSON.parse(JSON.stringify(a));
}

type HistoryState = Partial<Record<'data' | 'type' | 'settings' | 'program' | 'functions', any>>;
type HistoryStateProps = Array<keyof HistoryState>;

export default Vue.extend({
  name: 'home',
  async mounted() {
    (window as any).registry = Registry;
    (window as any).runtime = LiveRuntime;
    (window as any).home = this;
    (window as any).ex = ex;

    await this.loadType();
    this.loadData();
    this.loadProgram();
    this.loadHistory();
    this.loadFunctions();
    this.pushLast(['type', 'settings', 'data', 'program', 'functions']);
  },
  data: () => ({
    mode: 0,
    type: null as null | Type,
    settings: null as null | TypeSettings<any>,
    registry: Registry,
    readOnly: false,
    data: null as null | any,
    dataDebounce: 60 * 1000,
    dataTimeout: -1,
    program: NoExpression.instance as Expression,
    showComplexity: false,
    undos: [] as HistoryState[],
    redos: [] as HistoryState[],
    last: {} as HistoryState,
    pushing: false,
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
    isProgram(): boolean {
      return this.mode === 2;
    },
  },
  methods: {
    async addFunction() {
      const { registry } = this;
      const result = await getEditFunction({ registry });

      if (result) {
        this.saveFunctions();
      }
    },
    async editFunction(name: string) {
      const { registry } = this;
      const result = await getEditFunction({ registry, name });

      if (result) {
        this.saveFunctions();
      }
    },
    async clearFunctions() {
      if (await getConfirmation()) {
        this.registry.defs.functions = {};
        this.saveFunctions();
      }
    },
    saveFunctions() {
      this.historyPush(['functions'], () => {
        window.console.log('saving functions');

        this.saveVar('functions', this.getFunctionsData);
      });
    },
    loadFunctions() {
      const parsed = this.loadVar('functions', {}, this.parseFunctionsData);
      if (parsed) {
        this.registry.defs.functions = parsed;
      }
    },
    changeSummary(state: HistoryState[], count: number = 15) {
      let i = state.length;
      const summary = [];
      while (--count >= 0 && --i >= 0) {
        const keys = Object.keys(state[i]);
        summary.push(friendlyList(keys) + ' change');
      }
      return '<ol><li>' + summary.join('</li><li>') + '</li></ol>';
    },
    getFunctionsData() {
      return objectMap(this.registry.defs.functions, (func: Type) => func.encode());
    },
    parseFunctionsData(data: any): Record<string, FunctionType> | undefined {
      return isObject(data) ? objectMap(data, (f) => this.registry.defs.getType(f) as FunctionType) : undefined;
    },
    setFunctionsData(data: any) {
      const parsed = this.parseFunctionsData(data);
      if (parsed) {
        this.registry.defs.functions = parsed;
      }
    },
    getProgramData() {
      return this.program.encode();
    },
    parseProgramData(data: any): Expression | undefined {
      return data ? this.registry.defs.getExpression(data) : undefined;
    },
    setProgramData(data: any) {
      const parsed = this.parseProgramData(data);
      if (parsed) {
        this.program = parsed;
      }
    },
    getDataData() {
      return this.type ? this.type.toJson(this.data) : undefined;
    },
    parseDataData(data: any) {
      return this.type && data !== undefined ? this.type.fromJson(data) : undefined;
    },
    setDataData(data: any) {
      const parsed = this.parseDataData(data);
      if (parsed !== undefined) {
        this.data = parsed;
      }
    },
    getSettingsData() {
      return copy(this.settings);
    },
    parseSettingsData(data: any): TypeSettings<any, any> | null {
      return data ? copy(data) : null;
    },
    setSettingsData(data: any) {
      const parsed = this.parseSettingsData(data);
      if (parsed) {
        this.settings = parsed;
      }
    },
    getTypeData() {
      return this.type ? this.type.encode() : undefined;
    },
    parseTypeData(data: any): Type | null {
      return data ? this.registry.defs.getType(data) : null;
    },
    setTypeData(data: any) {
      const parsed = this.parseTypeData(data);
      if (parsed) {
        this.type = parsed;
      }
    },
    pushLast(push: HistoryStateProps) {
      push.forEach((prop) => {
        switch (prop) {
          case 'type': this.last.type = this.getTypeData(); break;
          case 'settings': this.last.settings = this.getSettingsData(); break;
          case 'data': this.last.data = this.getDataData(); break;
          case 'program': this.last.program = this.getProgramData(); break;
          case 'functions': this.last.functions = this.getFunctionsData(); break;
        }
      });
    },
    async describe() {
      const result = await getDescribeData({ registry: this.registry });
      if (result) {
        this.historyPush(['data', 'type', 'settings'], () => {
          this.type = result.type;
          this.settings = result.settings;
          this.data = result.data;

          this.saveType();
          this.saveData();
        });
      }
    },
    async getDefaultTypes(): Promise<TypeUpdateEvent | false> {
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

      this.historyPush(['type', 'settings', 'data', 'program'], () => {
        this.type = built.type;
        this.settings = built.settings;
        this.data = built.type.fromJson(built.settings.defaultValue);

        this.saveType();
        this.saveData();
        this.saveProgram(NoExpression.instance);
      });
    },
    async exportJson() {
      if (!this.type) {
        return;
      }

      const name = await getInput({ 
        title: 'Export',
        message: 'The name of the JSON file',
        label: 'Filename',
        value: 'export-' + Date.now(),
        confirm: 'Export',
        unconfirm: 'Cancel',
      });

      if (!name) {
        return;
      }

      const exported = JSON.stringify({
        type: this.getTypeData(),
        settings: this.getSettingsData(),
        data: this.getDataData(),
        program: this.getProgramData(),
        functions: this.getFunctionsData(),
      }, undefined, 2);

      this.downloadFile(name + '.json', exported, 'text/json');
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
      this.historyPush(['type', 'settings', 'data', 'program', 'functions'], () => {
        this.setTypeData(imported.type);
        this.setSettingsData(imported.settings);
        this.setDataData(imported.data);
        this.setProgramData(imported.program);
        this.setFunctionsData(imported.functions);

        this.saveType();
        this.saveData();
        this.saveProgram();
        this.saveFunctions();
      });
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
    handleChange(event: TypeUpdateEvent) {
      window.console.log('change', event);

      const states: HistoryStateProps = event.transform
        ? ['type', 'settings', 'data']
        : ['type', 'settings'];

      this.historyPush(states, () => {
        this.type = event.type;
        this.settings = event.settings;

        if (event.transform) { 
          this.transform(event.transform);
        }

        this.saveType();
      });
    },
    copyFromLast(state: HistoryState): HistoryState {
      const copied: HistoryState = {};
      for (const prop in state) {
        const key = prop as keyof HistoryState;
        copied[key] = copy(this.last[key]);
      }
      return copied;
    },
    historyUndo() {
      this.saveDataPending();

      const undo = this.undos.pop();
      if (undo) {
        this.redos.push(this.copyFromLast(undo));
        this.historyApply(undo);

        this.saveVar('redos', () => this.redos);
        this.saveVar('undos', () => this.undos); 
      }
    },
    historyRedo() {
      this.saveDataPending();

      const redo = this.redos.pop();
      if (redo) {
        this.undos.push(this.copyFromLast(redo));
        this.historyApply(redo);

        this.saveVar('redos', () => this.redos);
        this.saveVar('undos', () => this.undos);
      }
    },
    historyApply(state: HistoryState) {
      const push: HistoryStateProps = [];

      if (state.type) {
        this.setTypeData(state.type);
        push.push('type');
      }
      if (state.settings) {
        this.setSettingsData(state.settings);
        push.push('settings');
      }
      if (state.data !== undefined) {
        this.setDataData(state.data);
        push.push('data');
      }
      if (state.program) {
        this.setProgramData(state.program);
        push.push('program');
      }
      if (state.functions) {
        this.setFunctionsData(state.functions);
        push.push('functions');
      }
      this.pushLast(push);

      sendNotification({ message: 'Restored ' + friendlyList(push) });
    },
    historyPush(push: HistoryStateProps, callback: () => any) {

      this.saveDataPending();

      if (this.pushing) {
        callback();
        return;
      }

      this.pushing = true;
      const state: HistoryState = {};
      push.forEach((prop) => {
        state[prop] = copy(this.last[prop]);
      });

      if (this.redos.length) {
        this.redos = [];
        this.saveVar('redos', () => this.redos);
      }

      this.undos.push(state);
      this.saveVar('undos', () => this.undos);
      
      callback();
      this.pushLast(push);

      this.pushing = false;
    },
    loadHistory() {
      const undos = localStorage.getItem('undos');
      if (undos) {
        this.undos = JSON.parse(undos);
      }
      const redos = localStorage.getItem('redos');
      if (redos) {
        this.redos = JSON.parse(redos);
      }
    },
    saveType() {
      if (this.type === null || this.settings === null) {
        return;
      }

      this.saveVar('type', this.getTypeData);
      this.saveVar('settings', this.getSettingsData);
    },
    transform(expr: Expression) {
      if (expr instanceof Expression) {
        const cmd = LiveRuntime.getCommand(expr);

        this.data = cmd({ value: this.data });

        this.saveData();
      }
    },
    saveDataDebounce() {
      window.clearTimeout(this.dataTimeout);
      this.dataTimeout = window.setTimeout(() => {
        this.dataTimeout = -1;
        this.saveData();
      }, this.dataDebounce);
    },
    saveDataPending() {
      if (this.dataTimeout !== -1) {
        window.clearTimeout(this.dataTimeout);
        this.dataTimeout = -1;
        this.saveData();
      }
    },
    saveData() {
      if (this.data === null || this.type === null) {
        return;
      }

      this.historyPush(['data'], () => {
        if (this.data === null || this.type === null) {
          return;
        }

        window.console.log('saving data');

        this.saveVar('data', this.getDataData);
      });
    },
    saveProgram(program?: Expression) {
      this.historyPush(['program'], () => {
        if (program) {
          this.program = program;
          this.program.setParent();
        }

        window.console.log('saving program');

        this.saveVar('program', this.getProgramData);
      });
    },
    resetProgram() {
      this.saveProgram(NoExpression.instance);
    },
    async runProgram() {
      if (!this.type) {
        return;
      }

      const { type, registry, program, data } = this;

      try {
        await getRunProgram({ registry, type, program, data });
      } catch (e) {
        sendNotification({ message: 'There was an error in your program' });
      }
    },
    async loadType() {
      const defaults = await this.getDefaultTypes();

      if (!defaults) {
        return;
      }

      this.type = this.loadVar('type', defaults.type, this.parseTypeData);
      this.settings = this.loadVar('settings', defaults.settings, this.parseSettingsData);
    },
    loadData() {
      if (this.settings === null || this.type === null) {
        return;
      }

      this.data = this.loadVar('data', copy(this.settings.defaultValue), this.parseDataData);
    },
    loadProgram() {
      this.program = this.loadVar<Expression>('program', NoExpression.instance, this.parseProgramData);
      this.program.setParent();
    },
    loadVar<V>(varName: string, defaultValue: V, mapper?: (value: any) => V | undefined | null): V {
      const stored = localStorage.getItem(varName);
      if (stored) {
        let parsed = JSON.parse(stored);  
        if (mapper) {
          parsed = mapper(parsed);
        }
        if (parsed !== undefined && parsed !== null) {
          return parsed;
        }
      }
      return defaultValue;
    },
    saveVar(varName: string, getter: () => any) {
      const value = getter();
      if (value !== undefined) {
        localStorage.setItem(varName, JSON.stringify(value));
      }
    },
  },
});
</script>
