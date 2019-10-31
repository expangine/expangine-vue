<template>
  <v-app>

    <v-app-bar app dense elevate-on-scroll color="primary" dark>
      <v-menu offset-y close-on-content-click>
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
              <v-list-item-subtitle>Download current development environment as a JSON file.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="importJson">
            <v-list-item-icon>
              <v-icon>mdi-import</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Import</v-list-item-title>
              <v-list-item-subtitle>Upload a development environment JSON file.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="importCsv">
            <v-list-item-icon>
              <v-icon>mdi-file-delimited-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Import CSV</v-list-item-title>
              <v-list-item-subtitle>Upload data in a CSV.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="saveAsFunction">
            <v-list-item-icon>
              <v-icon>mdi-content-save-move-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Save as Function</v-list-item-title>
              <v-list-item-subtitle>Save this program as a function.</v-list-item-subtitle>
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
          <v-menu offset-x open-on-hover v-if="hasExamples">
            <template #activator="{ on }">
              <v-list-item v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-lightbulb-on</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Examples</v-list-item-title>
                  <v-list-item-subtitle>Try examples that have been created by the community.</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-menu-right</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>
            <v-list>
              <template v-for="ex in examples">
                <v-list-item :key="ex.text" @click="loadExample(ex.url)">
                  <v-list-item-content>
                    <v-list-item-title v-html="ex.text"></v-list-item-title>
                    <v-list-item-subtitle v-html="ex.description"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
          <v-divider></v-divider>
          <v-list-item @click="reset">
            <v-list-item-icon>
              <v-icon>mdi-refresh</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>New Program</v-list-item-title>
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
            View
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="metadataEditing = true">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Program Information</v-list-item-title>
              <v-list-item-subtitle>Author, Description, etc</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toggleReadOnly">
            <v-list-item-action>
              <v-checkbox
                v-model="readOnly"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Read Only</v-list-item-title>
              <v-list-item-subtitle>See what the tool looks like in read-only mode.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toggleComplexity">
            <v-list-item-action>
              <v-checkbox
                v-model="showComplexity"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Show Complexity</v-list-item-title>
              <v-list-item-subtitle>See the performance complexity for each expression in the program.</v-list-item-subtitle>
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
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn icon @click="runProgram" v-on="on">
            <v-icon>mdi-play</v-icon>
          </v-btn>
        </template>
        <span>Run Program</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn icon @click="debugProgram" v-on="on">
            <v-icon>mdi-bug</v-icon>
          </v-btn>
        </template>
        <span>Debug Program</span>
      </v-tooltip>
      <v-btn icon target="_blank" href="https://github.com/expangine/expangine-vue">
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="mode">
          <v-tabs-slider></v-tabs-slider>
          <v-tab :key="0">
            <v-icon>mdi-file-tree</v-icon>
            &nbsp;&nbsp;Design
          </v-tab>
          <v-tab :key="1">
            <v-icon>mdi-database-edit</v-icon>
            &nbsp;&nbsp;Data
          </v-tab>
          <v-tab :key="2">
            <v-icon>mdi-code-braces</v-icon>
            &nbsp;&nbsp;Program
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-content>
      <v-tabs-items v-model="mode" v-if="isReady">
        <v-tab-item :key="0">
          <v-container fluid>
            <ex-type-editor
              :type="type"
              :required-type="requiredType"
              :read-only="readOnly"
              :registry="registry"
              :settings="settings"
              @change="handleChange"
            ></ex-type-editor>
          </v-container>
        </v-tab-item>
        <v-tab-item :key="1">
          <v-container fluid>
            <ex-type-input
              :value="data"
              :type="type"
              :read-only="readOnly"
              :registry="registry"
              :settings="settings"
              @input="saveDataDebounce"
            ></ex-type-input>
          </v-container>
        </v-tab-item>
        <v-tab-item :key="2">
          <v-container fluid>
            <ex-expression
              can-remove
              :value="program"
              :context="type"
              :read-only="readOnly"
              :registry="registry"
              :settings="settings"
              :show-complexity="showComplexity"
              @remove="resetProgram"
              @input="saveProgram"
            ></ex-expression>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
      
      <ex-input-dialog></ex-input-dialog>
      <ex-notify-dialog></ex-notify-dialog>
      <ex-confirm-dialog></ex-confirm-dialog>
      <ex-build-type-dialog></ex-build-type-dialog>
      <ex-run-program-dialog></ex-run-program-dialog>
      <ex-simple-input-dialog></ex-simple-input-dialog>
      <ex-debug-program-dialog></ex-debug-program-dialog>
      <ex-describe-data-dialog></ex-describe-data-dialog>
      <ex-edit-function-dialog></ex-edit-function-dialog>
      <ex-test-function-dialog></ex-test-function-dialog>
      <ex-test-operation-dialog></ex-test-operation-dialog>

      <v-dialog v-model="metadataEditing" max-width="800">
        <v-card>
          <v-card-title class="headline">
            Program Information
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    outlined
                    hide-details
                    label="Title"
                    v-model="metadata.title"
                    @change="saveMetadata"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    outlined
                    hide-details
                    label="Author"
                    v-model="metadata.author"
                    @change="saveMetadata"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    outlined
                    hide-details
                    auto-grow
                    label="Description"
                    rows="5"
                    v-model="metadata.description"
                    @change="saveMetadata"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-chip label>
              Created: {{ metadata.created }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary"
              @click="metadataEditing = false"
            >Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>

  </v-app>
</template>

<script lang="ts">

import Vue from 'vue';
import * as Papa from 'papaparse';
import * as ex from 'expangine-runtime';
import { Type, defs, copy, Expression, isString, isObject, NoExpression, objectMap, FunctionType, ObjectType, NumberType, TypeBuilder, Traverser, TextType, DateFormat, currentLocale, isArray, AnyType, ReturnExpression, objectValues } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { TypeVisuals, TypeSettings, TypeUpdateEvent, TypeSettingsRecord, TypeSettingsAny } from './runtime/types/TypeVisuals';
import { ObjectBuilder as DefaultBuilder } from './runtime/types/object';
import { getConfirmation } from './app/Confirm';
import { sendNotification } from './app/Notify';
import { getRunProgram } from './app/RunProgram';
import { getDebugProgram } from './app/DebugProgram';
import { getDescribeData } from './app/DescribeData';
import { getEditFunction } from './app/EditFunction';
import { getSimpleInput, SimpleInputOptions } from './app/SimpleInput';
import { getInput } from './app/Input';
import { friendlyList, SimpleFieldOption } from '@/common';
import Registry from './runtime';



type HistoryState = Partial<Record<'data' | 'type' | 'settings' | 'program' | 'functions', any>>;
type HistoryStateProps = Array<keyof HistoryState>;


export default Vue.extend({
  name: 'App',
  data: () => ({
    mode: 0,
    type: null as null | Type,
    requiredType: null, 
    settings: null as null | TypeSettings<any>,
    registry: Registry,
    metadataEditing: false,
    metadata: {
      title: '',
      description: '',
      author: '',
      created: '',
    },
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
    examples: [] as any[],
  }),
  computed: {
    isReady(): boolean {
      return !!(this.type && this.settings);
    },
    hasExamples(): boolean {
      return this.examples.length > 0;
    },
  },
  async mounted() {
    (window as any).registry = Registry;
    (window as any).runtime = LiveRuntime;
    (window as any).home = this;
    (window as any).ex = ex;

    this.loadExamples();
    await this.loadType();
    this.loadData();
    this.loadProgram();
    this.loadHistory();
    this.loadFunctions();
    this.loadMetadata();
    this.pushLast(['type', 'settings', 'data', 'program', 'functions']);
  },
  methods: {
    toggleReadOnly() {
      this.readOnly = !this.readOnly;
    },
    toggleComplexity() {
      this.showComplexity = !this.showComplexity;
    },
    async loadExamples() {
      const response = await fetch(location.protocol + '//expangine.github.io/expangine-vue/examples/index.json');
      const examples = await response.json();

      if (isArray(examples)) {
        this.examples = examples;
      }
    },
    getMetadata() {
      return {
        title: '',
        description: '',
        author: '',
        created: DateFormat.format('LLL', [new Date(), currentLocale]),
      };
    },
    loadMetadata() {
      const parsed = this.loadVar('metadata', this.getMetadata());
      if (parsed) {
        this.metadata = parsed;
      }
    },
    saveMetadata() {
      this.saveVar('metadata', this.getMetadataData);
    },
    setMetadataData(data: any) {
      if (data) {
        this.metadata = data;
      } else {
        this.metadata = this.getMetadata();
      }
    },
    getMetadataData() {
      return copy(this.metadata);
    },
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
        this.registry.defs.functions = LiveRuntime.defs.functions = {};
        this.saveFunctions();
      }
    },
    async loadExample(url: string) {
      const response = await fetch(location.protocol + url);
      const data = await response.json();

      if (isObject(data) && data.type && data.settings && data.program) {
        if (await getConfirmation({ message: 'This will overwrite your current program, are you sure?' })) {
          this.importData(data);
        } else {
          sendNotification({ message: 'Importing example canceled.' });
        }
      } else {
        sendNotification({ message: 'This example seems corrupted, sorry!' });
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
        this.registry.defs.functions = LiveRuntime.defs.functions = parsed;
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
        this.registry.defs.functions = LiveRuntime.defs.functions = parsed;
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
        this.program.setParent();
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
    async saveAsFunction() {
      if (!this.type || !(this.type instanceof ObjectType)) {
        return sendNotification({ message: 'Save as Function requires the input to be an object.' });
      }

      const functionName = await getInput({ label: 'Function Name' });

      if (!functionName) {
        return sendNotification({ message: 'Save as Function canceled' });
      }

      if (this.registry.defs.functions[functionName]) {
        if (!await getConfirmation({ message: 'A function with that name already exists, overwrite it?' })) {
          return sendNotification({ message: 'Save as Function canceled' });
        }
      }

      const params = this.registry.defs.cloneType(this.type) as ObjectType;
      const expression = new ReturnExpression(this.registry.defs.cloneExpression(this.program));
      const returnType = expression.getType(this.registry.defs, params) || AnyType.baseType;
      
      const newFunction = new FunctionType({
        params,
        expression,
        returnType,
      });

      this.$set(this.registry.defs.functions, functionName, newFunction);

      this.saveFunctions();
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
        this.metadata = this.getMetadata();

        this.saveType();
        this.saveData();
        this.saveProgram(NoExpression.instance);
        this.saveMetadata();
      });
    },
    async exportJson() {
      if (!this.type) {
        return;
      }

      const settings = await getSimpleInput({
        title: 'Export',
        confirm: 'Export',
        unconfirm: 'Cancel',
        value: {
          name: 'export-' + Date.now(),
          metadata: true,
          type: true,
          settings: true,
          data: true,
          program: true,
          functions: true,
        },
        fields: [
          { name: 'name', type: 'text', label: 'Export As', required: true, details: 'The name of the exported file, without .json extension.' },
          { name: 'metadata', type: 'boolean', label: 'Include Metadata', required: true, details: 'Export program name, description, and author?'},
          { name: 'type', type: 'boolean', label: 'Type', required: true, details: 'Export the designed data type?' },
          { name: 'settings', type: 'boolean', label: 'Type Visual Settings', required: true, details: 'Export the visual settings for your data (how your input looks in the Data tab).' },
          { name: 'data', type: 'boolean', label: 'Data', required: true },
          { name: 'program', type: 'boolean', label: 'Program', required: true },
          { name: 'functions', type: 'boolean', label: 'Functions', required: true, details: friendlyList(objectValues(this.registry.defs.functions, (f, name) => name)) },
        ],
      });

      if (!settings || !settings.name) {
        sendNotification({ message: 'Export canceled.' });
        return;
      }

      const exporting: any = {};

      if (settings.metadata) {
        exporting.metadata = this.getMetadataData();
      }
      if (settings.type) {
        exporting.type = this.getTypeData();
      }
      if (settings.settings) {
        exporting.settings = this.getSettingsData();
      }
      if (settings.data) {
        exporting.data = this.getDataData();
      }
      if (settings.program) {
        exporting.program = this.getProgramData();
      }
      if (settings.functions) {
        exporting.functions = this.getFunctionsData();
      }

      const exported = JSON.stringify(exporting, undefined, 2);

      this.downloadFile(settings.name + '.json', exported, 'text/json');
    },
    importCsv() {
      const finput = document.createElement('input');
      finput.type = 'file';
      finput.multiple = true;
      finput.accept = '.csv';
      finput.onchange = (e) => finput.files && finput.files.length > 0 ? this.importCsvFile(finput.files[0]) : undefined;
      finput.click();
      finput.remove();
    },
    importCsvFile(file: File) {
      Papa.parse(file, {
        header: true,
        complete: async ({ data, meta }: { data: any, meta: { fields: string[], aborted: boolean }}) => {
          if (meta.aborted) {
            sendNotification({ message: 'There was a problem parsing the CSV.' });
          } else {
            const fields: SimpleFieldOption[] = [
              { name: 'property', type: 'text', label: 'Property', details: 'The property to store the CSV data in.' },
              { name: 'columns', type: 'object', label: 'Columns', 
                fields: meta.fields.map((column) => ({
                  name: column,
                  type: 'boolean',
                  label: column,
                })),
              },
            ];

            if (this.type instanceof ObjectType) {
              fields.push({
                name: 'action',
                type: 'select',
                label: 'Action',
                items: [
                  { text: 'Replace data & type', value: 'replace' },
                  { text: 'Add as property of current data & type', value: 'merge' },
                ],
              });
            }

            const settings = await getSimpleInput<any>({
              value: { columns: {}, action: 'replace', property: 'data' },
              fields,
            });
  
            data.forEach((row: any) => {
              for (const prop in row) {
                if (!settings.columns[prop]) {
                  delete row[prop];
                }
              }
            });

            if (settings.action === 'replace') {
              data = { [settings.property]: data };

              const type = this.registry.defs.describe(data);
              type.removeDescribedRestrictions();
              
              const typeSettings = this.registry.getTypeSettings(type);

              this.historyPush(['data', 'type', 'settings'], () => {
                this.type = type;
                this.settings = typeSettings;
                this.data = data;

                this.saveType();
                this.saveData();
              });
            } else {
              const type = this.registry.defs.describe(data);
              type.removeDescribedRestrictions();

              const typeSettings = this.registry.getTypeSettings(type);

              this.historyPush(['data', 'type', 'settings'], () => {
                if (this.type instanceof ObjectType) {
                  this.$set(this.type.options.props, settings.property, type);
                  this.$set((this.settings as any).sub, settings.property, typeSettings);
                  this.$set(this.data, settings.property, data);

                  this.saveType();
                  this.saveData();
                }
              });
            }
          }
        },
      });
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

            this.importData(parsed, true);
          } catch (e) {
            sendNotification({ message: 'The file selected did not contain a valid JSON value.' });
          }
        } else {
          sendNotification({ message: 'The file selected was not a valid file.' });
        }
      };
      reader.readAsText(file);
    },
    async importData(imported: any, customize: boolean = false) {
      
      const currentObject = this.type instanceof ObjectType;
      const fields: Record<string, SimpleFieldOption> = {};

      let value = {
        metadata: false,
        type: 'ignore' as 'ignore' | 'replace' | 'merge',
        typeMergeName: 'imported_data',
        settings: false,
        data: 'ignore' as 'ignore' | 'merge' | 'replace',
        program: 'ignore' as 'ignore' | 'saveas' | 'replace',
        programFunctionName: 'imported_function',
        functions: 'ignore' as 'ignore' | 'mergeReplace' | 'mergeIgnore' | 'replace',
      };

      if (imported.metadata) {
        value.metadata = true;
        fields.metadata = { name: 'metadata', type: 'boolean', label: 'Metadata' };
      }

      if (imported.data !== undefined) {
        fields.data = { name: 'data', type: 'select', label: 'Data', required: true, items: [
          { text: 'Ignore data', value: 'ignore' },
        ]};
      }

      if (imported.type) {
        value.type = 'replace';
        fields.type = { name: 'type', type: 'select', label: 'Type', required: true, items: [
          { text: 'Replace type', value: 'replace' },
          { text: 'Ignore type', value: 'ignore' },
        ]};
        
        if (currentObject && fields.type.items) {
          fields.type.items.push({ text: 'Add imported type as property of current type', value: 'merge' });
          fields.typeMergeName = { name: 'typeMergeName', type: 'text', label: 'Property', details: 'Only applicable if "Type" is "Add imported type..."' };
        }

        if (imported.data !== undefined && fields.data.items) {
          fields.data.items.push({ text: 'Replace or merge data', value: 'merge' });
          value.data = 'merge';
        }
      }

      if (imported.settings) {
        value.settings = true;
        fields.settings = { name: 'settings', type: 'boolean', label: 'Settings', required: true };
      }

      if (imported.data !== undefined) {
        const parsed = this.parseDataData(imported.data);
        if (this.type && this.type.isValid(parsed) && fields.data.items) {
          fields.data.items.push({ text: 'Repace data', value: 'replace' });
          if (value.data === 'ignore') {
            value.data = 'replace';
          }
        }
      }

      if (imported.program) {
        value.program = 'replace';
        fields.program = { name: 'program', type: 'select', label: 'Program', required: true, items: [
          { text: 'Replace program', value: 'replace' },
          { text: 'Ignore program', value: 'ignore' },
        ]};

        if (imported.type && fields.program.items) {
          fields.program.items.push({ text: 'Save program as function', value: 'saveas' });
          fields.programFunctionName = { name: 'programFunctionName', type: 'text', label: 'Function Name', details: 'Only applicable if "Program" is "Save program as function"' };
        }
      }

      if (imported.functions) {
        value.functions = 'replace';
        fields.functions = { name: 'functions', type: 'select', label: 'Functions', required: true, items: [
          { text: 'Replace functions', value: 'replace' },
          { text: 'Merge functions, replace existing', value: 'mergeReplace' },
          { text: 'Merge functions, ignore existing', value: 'mergeIgnore' },
          { text: 'Ignore functions', value: 'ignore' },
        ]};
      }

      if (customize) {
        const newValue = await getSimpleInput<any>({
          title: 'Import Options',
          message: 'Actions to perform on import',
          confirm: 'Import',
          unconfirm: 'Cancel',
          value,
          fields: objectValues(fields),
        });

        if (!newValue) {
          return sendNotification({ message: 'Import canceled.' });
        }

        if (value.type === 'merge' && (!value.typeMergeName || (this.type instanceof ObjectType && this.type.options.props[value.typeMergeName]))) {
          return sendNotification({ message: 'Import canceled, if you want to merge a type you need to name a unique property.' });
        }

        if (value.program === 'saveas' && (!value.programFunctionName || (this.registry.defs.functions[value.programFunctionName]))) {
          return sendNotification({ message: 'Import canceled, if you want to save the program as a function you need to supply a unique function name.' });
        }

        value = newValue;
      }

      const importing: HistoryStateProps = [];
      if (value.type !== 'ignore') {
        importing.push('type');
      }
      if (value.settings) {
        importing.push('settings');
      }
      if (value.data !== 'ignore') {
        importing.push('data');
      }
      if (value.program !== 'ignore') {
        importing.push('program');
      }
      if (value.functions !== 'ignore') {
        importing.push('functions');
      }

      this.historyPush(importing, () => {

        let functionsChanged = false;

        switch (value.type) {
          case 'replace':
            this.setTypeData(imported.type);
            if (value.settings) {
              this.setSettingsData(imported.settings);
            } else if (this.type) {
              this.settings = this.registry.getTypeSettings(this.type);
            }
            this.saveType();
            if (value.data !== 'ignore') {
              this.setDataData(imported.data);
              this.saveData();
            }
            break;
          case 'merge':
            const importedType = this.parseTypeData(imported.type);
            if (this.type instanceof ObjectType && this.settings) {
              this.$set(this.type.options.props, value.typeMergeName, importedType);
              if (value.settings) {
                this.$set((this.settings as any).sub, value.typeMergeName, this.parseSettingsData(imported.settings));
              } else if (importedType) {
                this.$set((this.settings as any).sub, value.typeMergeName, this.registry.getTypeSettings(importedType));
              }
              this.saveType();
              if (value.data !== 'ignore') {
                this.$set(this.data, value.typeMergeName, this.parseDataData(imported.data));
                this.saveData();
              }
            }
            break;
          default:
            if (value.data !== 'ignore') {
              this.setDataData(imported.data);
              this.saveData();
            }
            break;
        }

        switch (value.functions) {
          case 'replace':
            this.setFunctionsData(imported.functions);
            functionsChanged = true;
            break;
          case 'mergeReplace':
            const mergeReplace = this.parseFunctionsData(imported.functions);
            const functionsReplace = this.registry.defs.functions;

            for (const functionName in mergeReplace) {
              this.$set(functionsReplace, functionName, mergeReplace[functionName]);
              functionsChanged = true;
            }
            break;
          case 'mergeIgnore':
            const mergeIgnore = this.parseFunctionsData(imported.functions);
            const functionsIgnore = this.registry.defs.functions;

            for (const functionName in mergeReplace) {
              if (!functionsIgnore[functionName]) {
                this.$set(functionsIgnore, functionName, mergeReplace[functionName]);
                functionsChanged = true;
              }
            }
            break;
        }

        switch (value.program) {
          case 'replace':
            this.setProgramData(imported.program);
            this.saveProgram();
            break;
          case 'saveas':
            const functions = this.registry.defs.functions;
            const program = this.parseProgramData(imported.program);
            const params = this.parseTypeData(imported.type);
            if (program && params instanceof ObjectType) {
              const returnType = program.getType(this.registry.defs, params) || AnyType.baseType;
              const expression = program instanceof ReturnExpression
                ? program
                : new ReturnExpression(program);

              this.$set(functions, value.programFunctionName, new FunctionType({
                returnType,
                params, 
                expression,
              }));
              functionsChanged = true;
            }
            break;
        }

        if (value.metadata) {
          this.setMetadataData(imported.metadata);
          this.saveMetadata();
        }

        if (functionsChanged) {
          this.saveFunctions();
        }
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
      const useResults = this.useProgramResults;
      const useResultsLabel = 'Use results as the data for a new program';

      try {
        await getRunProgram({ registry, type, program, data, useResults, useResultsLabel });
      } catch (e) {
        sendNotification({ message: 'There was an error in your program' });
        
        window.console.log(e);
      }
    },
    async useProgramResults(data: any): Promise<boolean> {
      if (await getConfirmation({ message: 'This will overwrite your current data, are you sure?' })) {
        const type = this.registry.defs.describe(data);
        const settings = this.registry.getTypeSettings(type);

        if (this.type && this.type.acceptsData(type)) {
          this.historyPush(['data'], () => {
            this.data = data;

            this.saveData();
          });
        } else {
          this.historyPush(['type', 'settings', 'data'], () => {
            type.removeDescribedRestrictions();

            this.data = data;
            this.type = type;
            this.settings = settings;

            this.saveType();
            this.saveData();
          });
        }

        return true;
      }
      return false;
    },
    async debugProgram() {
      if (!this.type) {
        return;
      }

      const { type, registry, program, data } = this;

      try {
        await getDebugProgram({ registry, type, program, data });
      } catch (e) {
        sendNotification({ message: 'There was an error in your program' });
        
        window.console.log(e);
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