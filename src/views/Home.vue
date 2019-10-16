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
              <v-btn text>
                Program
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
            <v-btn text @click="runProgram">
              <v-icon>mdi-play</v-icon>
              Run
            </v-btn>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-btn text v-on="on" @click="historyUndo" :disabled="undos.length === 0">
                  <v-icon>mdi-undo</v-icon>
                  Undo
                </v-btn>
              </template>
              <span v-html="undoSummary"></span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-btn text v-on="on" @click="historyRedo" :disabled="redos.length === 0">
                  Redo
                  <v-icon>mdi-redo</v-icon>
                </v-btn>
              </template>
              <span v-html="redoSummary"></span>
            </v-tooltip>
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
            @input="saveData"
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
import { Type, defs, Expression, isString, NoExpression } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import Registry from '../runtime';
import { TypeVisuals, TypeSettings, TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { ObjectBuilder as DefaultBuilder } from '../runtime/types/object';
import { getConfirmation } from '../app/Confirm';
import { sendNotification } from '../app/Notify';
import { getRunProgram } from '../app/RunProgram';
import { friendlyList } from '@/common';



function copy(a: any): any {
  return JSON.parse(JSON.stringify(a));
}

interface HistoryState {
  data?: any;
  type?: any;
  settings?: any;
  program?: any;
}
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
    this.pushLast(['type', 'settings', 'data', 'program']);
  },
  data: () => ({
    mode: 0,
    type: null as null | Type,
    settings: null as null | TypeSettings<any>,
    registry: Registry,
    readOnly: false,
    data: null as null | any,
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
    undoSummary(): string {
      return this.changeSummary(this.undos);
    },
    redoSummary(): string {
      return this.changeSummary(this.redos);
    },
  },
  methods: {
    changeSummary(state: HistoryState[], count: number = 15) {
      let i = state.length;
      const summary = [];
      while (--count >= 0 && --i >= 0) {
        const keys = Object.keys(state[i]);
        summary.push(friendlyList(keys) + ' change');
      }
      return '<ol><li>' + summary.join('</li><li>') + '</li></ol>';
    },
    pushLast(push: HistoryStateProps) {
      push.forEach((prop) => {
        switch (prop) {
          case 'type': this.last.type = this.type ? this.type.encode() : undefined; break;
          case 'settings': this.last.settings = copy(this.settings); break;
          case 'data': this.last.data = this.type ? this.type.toJson(this.data) : undefined; break;
          case 'program': this.last.program = this.program.encode(); break;
        }
      });
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
    exportJson() {
      if (!this.type) {
        return;
      }

      const exported = JSON.stringify({
        type: this.type.encode(),
        settings: this.settings,
        data: this.type.toJson(this.data),
        program: this.program.encode(),
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
      this.program = this.registry.defs.getExpression(imported.program);
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
    historyUndo() {
      const undo = this.undos.pop();
      if (undo) {
        this.historyApply(undo);
        this.redos.push(undo);

        localStorage.setItem('redos', JSON.stringify(this.redos));
      }
    },
    historyRedo() {
      const redo = this.redos.pop();
      if (redo) {
        this.historyApply(redo);
        this.undos.push(redo);

        localStorage.setItem('undos', JSON.stringify(this.undos));
      }
    },
    historyApply(state: HistoryState) {
      const push: HistoryStateProps = [];

      if (state.type) {
        this.type = this.registry.defs.getType(state.type);
        push.push('type');
      }
      if (state.settings) {
        this.settings = copy(state.settings);
        push.push('settings');
      }
      if (state.data && this.type) {
        this.data = this.type.fromJson(state.data);
        push.push('data');
      }
      if (state.program) {
        this.program = this.registry.defs.getExpression(state.program);
        push.push('program');
      }
      this.pushLast(push);

      sendNotification({ message: 'Restored ' + friendlyList(push) });
    },
    historyPush(push: HistoryStateProps, callback: () => any) {
      if (this.pushing) {
        callback();
        return;
      }

      this.pushing = true;
      const state: HistoryState = {};
      push.forEach((prop) => {
        state[prop] = this.last[prop];
      });

      if (this.redos.length) {
        this.redos = [];

        localStorage.setItem('redos', JSON.stringify(this.redos));
      }
      this.undos.push(state);

      localStorage.setItem('undos', JSON.stringify(this.undos));
      
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

      localStorage.setItem('type', JSON.stringify(this.type.encode()));
      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    transform(expr: Expression) {
      if (expr instanceof Expression) {
        const cmd = LiveRuntime.getCommand(expr);

        this.data = cmd({ value: this.data });

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

        localStorage.setItem('data', JSON.stringify(this.type.toJson(this.data)));
      });
    },
    saveProgram(program: Expression) {
      this.historyPush(['program'], () => {
        this.program = program;
        this.program.setParent();

        window.console.log('saving program');

        localStorage.setItem('program', JSON.stringify(this.program.encode()));
      });
    },
    resetProgram() {
      this.saveProgram(NoExpression.instance);
    },
    runProgram() {
      if (!this.type) {
        return;
      }

      const { type, registry, program, data } = this;

      getRunProgram({ registry, type, program, data });
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
    loadProgram() {
      this.program = this.loadVar('program', NoExpression.instance, (v) => this.registry.defs.getExpression(v));
      this.program.setParent();
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
