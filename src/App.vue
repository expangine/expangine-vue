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
              <v-list-item-subtitle>Download project as a JSON file.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="importJson">
            <v-list-item-icon>
              <v-icon>mdi-import</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Import</v-list-item-title>
              <v-list-item-subtitle>Upload a project JSON file.</v-list-item-subtitle>
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
          <v-list-item @click="share">
            <v-list-item-icon>
              <v-icon>mdi-share</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Share</v-list-item-title>
              <v-list-item-subtitle>Send expangine or a friend your project via E-mail.</v-list-item-subtitle>
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
              <v-list-item-title>New Project</v-list-item-title>
              <v-list-item-subtitle>Clears everything except your functions.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn text v-on="on">
            Edit
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="toggleAutoSave">
            <v-list-item-action>
              <v-checkbox
                :input-value="autoSave.value"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Auto Save</v-list-item-title>
              <v-list-item-subtitle>Your project is automatically saved to your browser so you can resume your work anytime.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="saveDataPending" :disabled="isDataSaved">
            <v-list-item-icon>
              <v-icon>mdi-clock-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Save Pending</v-list-item-title>
              <v-list-item-subtitle>Your data changes are saved periodically.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="historyUndo" :disabled="undoEmpty">
            <v-list-item-icon>
              <v-icon>mdi-undo</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Undo</v-list-item-title>
              <v-list-item-subtitle>{{ undoLabel }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="historyRedo" :disabled="redoEmpty">
            <v-list-item-icon>
              <v-icon>mdi-redo</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Redo</v-list-item-title>
              <v-list-item-subtitle>{{ redoLabel }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="historyClear" :disabled="historyEmpty">
            <v-list-item-icon>
              <v-icon>mdi-trash-can</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Clear History</v-list-item-title>
              <v-list-item-subtitle>Free up browser space by clearing undo/redo history.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="historyDrawer = true" :disabled="historyEmpty">
            <v-list-item-icon>
              <v-icon>mdi-altimeter</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>View Change History</v-list-item-title>
              <v-list-item-subtitle>View all stored undo/redo events and go to any point in time.</v-list-item-subtitle>
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
          <v-list-item @click="showOperations = true">
            <v-list-item-icon>
              <v-icon>mdi-file-document-box-search-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Operation Catalogue</v-list-item-title>
              <v-list-item-subtitle>Search through the list of available operations.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toggleReadOnly">
            <v-list-item-action>
              <v-checkbox
                :input-value="readOnly"
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
                color="#FFE0B2"
                :input-value="showComplexity"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Show Complexity</v-list-item-title>
              <v-list-item-subtitle>See the performance complexity for each expression in the program.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="toggleShowReturnExpressions">
            <v-list-item-action>
              <v-checkbox
                :color="showReturnColor"
                :input-value="showReturnExpressions"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Show Return Expressions</v-list-item-title>
              <v-list-item-subtitle>See which expressions define the program return type.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="showExamples = true">
            <v-list-item-icon>
              <v-icon>mdi-lightbulb-on</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Introduction Dialog</v-list-item-title>
              <v-list-item-subtitle>Show the dialog your saw when you first visited this application.</v-list-item-subtitle>
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
          <template v-for="(func, name) in functions">
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
      <v-btn icon target="_blank" href="https://github.com/expangine/">
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

      <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        absolute
        bottom
        color="primary"
      ></v-progress-linear>
    </v-app-bar>

    <v-content>
      <v-tabs-items v-if="initialized" touchless v-model="mode">
        <v-tab-item :key="0">
          <v-container fluid>
            <ex-type-editor
              :type="type"
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
              :highlight="highlightExpressions"
              @remove="resetProgram"
              @input="saveProgram"
            ></ex-expression>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
      <div v-else class="pa-3">
        <v-skeleton-loader
          type="list-item-avatar-three-line"
        ></v-skeleton-loader>
      </div>
      
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
      <ex-operation-catalogue-dialog
        :registry="registry"
        :show.sync="showOperations"
      ></ex-operation-catalogue-dialog>

      <v-dialog v-model="metadataEditing" max-width="800"  :fullscreen="$vuetify.breakpoint.mdAndDown">
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

      <v-dialog v-model="showExamples" max-width="800" :fullscreen="$vuetify.breakpoint.mdAndDown">
        <v-card>
          <v-card-title class="headline">
            Welcome to Expangine!
          </v-card-title>
          <v-card-text>
            Expangine is a visual development framework. 
            It's a series of TypeScript/JS libraries which provide data type functionality and operations as well as runtimes which convert your operations and programs into any desired output. At the moment the only runtime is one that executes the program you've developed in the browser (or NodeJS). Potential runtimes could convert your program into any Programming Language or into a series of SQL commands.
            <strong>expangine-vue</strong> is the component library built from Vue &amp; Vuetify. This is just an example interface, any interface could be used to create programs and types.
          </v-card-text>
          <v-card-text>
            <p>Listed below are examples to start you off.</p>
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
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary"
              @click="showExamples = false"
            >Skip</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-navigation-drawer
        v-model="historyDrawer"
        right
        fixed
        temporary
        disable-resize-watcher
        disable-route-watcher
      >
        <ex-project-history-list
          :history="history"
        ></ex-project-history-list>
      </v-navigation-drawer>
    </v-content>

  </v-app>
</template>

<script lang="ts">

import Vue from 'vue';
import * as ex from 'expangine-runtime';
import { Type, defs, copy, Expression, isString, isObject, NoExpression, objectMap, objectEach, FunctionType, ObjectType, NumberType, TypeBuilder, Traverser, TextType, DateFormat, currentLocale, isArray, AnyType, ReturnExpression, objectValues, NullType } from 'expangine-runtime';
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
import { getFile, FileImportStatus } from './app/FileImport';
import { Project } from './app/Project';
import { ProjectHistory, ProjectState, PROJECT_STATE_META } from './app/ProjectHistory';
import { getProjectImport } from './app/ProjectImport';
import { getProjectExport } from './app/ProjectExport';
import { getDataImport } from './app/DataImport';
import { getSendMail } from './app/SendMail';
import { newStore, TranscoderStore } from './app/Transcoder';
import { exportFile } from './app/FileExport';
import { friendlyList, SimpleFieldOption } from '@/common';
import { getPromiser } from './app/Promiser';
import Registry from './runtime';
import { Store } from './app/Store';




const autoSave = (() => {
  const store = newStore('autoSave', {
    encode: (value: boolean) => value,
    decode: (data: boolean) => data,
    getDefault: () => true,
  });

  store.load().then((initialValue) => autoSave.value = initialValue);

  return {
    value: true,
    can: () => autoSave.value,
    set(value: boolean) {
      store.save(this.value = value);
    },
  };
})();


export default Vue.extend({
  name: 'App',
  data: () => ({
    // Project Data
    metadata: { title: '', description: '', author: '', created: '' },
    type: new ObjectType({ props: {} }) as Type,
    settings: { input: 'none', options: {} } as TypeSettingsAny,
    registry: Registry,
    data: null as any,
    program: NoExpression.instance as Expression,
    // Editor Properties
    initialized: false,
    autoSave,
    mode: 0,
    metadataEditing: false,
    readOnly: false,
    showComplexity: false,
    showReturnExpressions: false,
    showReturnColor: '#E1BEE7',
    examples: [] as any[],
    showExamples: false,
    highlightExpressions: new Map(),
    dataDebounce: 60 * 1000,
    dataTimeout: -1,
    loading: 0,
    showOperations: false,
    // History
    historyEmpty: true,
    undoEmpty: true,
    undoLabel: '',
    redoEmpty: true,
    redoLabel: '',
    historyDrawer: false,
  }),
  computed: 
  {
    hasExamples(): boolean {
      return this.examples.length > 0;
    },
    isLoading(): boolean {
      return this.loading > 0;
    },
    functions: {
      get(): Record<string, FunctionType> {
        return this.registry.defs.functions;
      },
      set(value: Record<string, FunctionType>) {
        this.registry.defs.functions = LiveRuntime.defs.functions = value;
      },
    },
    history(): ProjectHistory {
      window.console.log('history created');

      return new ProjectHistory({
        project: this, 
        transcoders: this.store, 
        canSave: autoSave.can,
      });
    },
    store() {
      window.console.log('store created');

      const canSave = autoSave.can;
      
      return {
        type: newStore('type', {
          encode: (value: Type) => value.encode(),
          decode: (data: any) => this.registry.defs.getType(data),
          getDefault: () => new ObjectType({ props: {} }),
          canSave,
        }),
        settings: newStore('settings', {
          encode: (value: TypeSettingsAny) => copy(value),
          decode: (data: any) => copy(data) as TypeSettingsAny,
          getDefault: () => this.registry.getTypeSettings(this.type),
          canSave,
        }),
        data: newStore('data', {
          encode: (value: any) => this.type.toJson(value),
          decode: (data: any) => this.type.fromJson(data),
          getDefault: () => this.type.fromJson(copy(this.settings.defaultValue)),
          canSave,
        }),
        program: newStore('program', {
          encode: (value: Expression) => value.encode(),
          decode: (data: any) => {
            const program = this.registry.defs.getExpression(data);
            program.setParent();

            return program;
          },
          getDefault: () => NoExpression.instance,
          canSave,
        }),
        metadata: newStore('metadata', {
          encode: (value: any) => copy(value),
          decode: (data: any) => copy(data),
          getDefault: () => ({
            title: '',
            description: '',
            author: '',
            created: DateFormat.format('LLL', [new Date(), currentLocale]),
          }),
          canSave,
        }),
        functions: newStore('functions', {
          encode: (value: Record<string, FunctionType>) => objectMap(value, (func) => func.encode()),
          decode: (data: any) => objectMap(data, (functionData) => this.registry.defs.getType(functionData) as FunctionType),
          getDefault: () => this.registry.defs.functions,
          canSave,
        }),
      };
    },
    isDataSaved(): boolean {
      return this.dataTimeout === -1;
    },
  },
  watch: {
    showReturnExpressions: 'updateHighlightExpressions',
    program: 'updateHighlightExpressions',
  },
  async mounted() {
    (window as any).registry = Registry;
    (window as any).runtime = LiveRuntime;
    (window as any).home = this;
    (window as any).ex = ex;

    this.loadExamples();

    this.type = await this.store.type.load();
    this.settings = await this.store.settings.load();
    this.data = await this.store.data.load();
    this.program = await this.store.program.load();
    this.functions = await this.store.functions.load();
    this.metadata = await this.store.metadata.load();
    
    this.history.resetLast();

    this.store.type.on('saveError', this.onSaveError);
    this.store.settings.on('saveError', this.onSaveError);
    this.store.data.on('saveError', this.onSaveError);
    this.store.program.on('saveError', this.onSaveError);
    this.store.functions.on('saveError', this.onSaveError);
    this.store.metadata.on('saveError', this.onSaveError);
    this.history.redosTranscoder.on('saveError', this.onSaveError);
    this.history.undosTranscoder.on('saveError', this.onSaveError);

    this.updateHistoryData();
    this.history.on('change', this.updateHistoryData);

    this.initialized = true;
  },  
  methods: {
    // SAVE ERROR
    async onSaveError(error: any, transcoder: TranscoderStore<any, any>): Promise<boolean>
    {
      const options = await getSimpleInput({
        title: 'Oh no!',
        message: 'There was an error saving your project data to your browser. This data is saved to your browser so you don\'t lose your work if the browser closes. If you have a lot of data or a long undo/redo history this error can be thrown. What would you like to do next to avoid this problem?',
        value: { 
          action: 'history' as 'clear' | 'ignore' | 'history',
          retry: false,
        },
        fields: [
          { name: 'action', type: 'select', label: 'Action', items: [
            { text: 'Clear all project data', value: 'clear' },
            { text: 'Clear undo/redo history only', value: 'history' },
            { text: 'Ignore error', value: 'ignore' },
          ]},
          { name: 'retry', type: 'boolean', label: 'Retry' },
        ],
      });

      if (!options) 
      {
        return false;
      }
      
      switch (options.action) 
      {
        case 'history':
          Store.remove('redos');
          Store.remove('undos');
          sendNotification({ message: 'Undo/redo history cleared.' });
          break;

        case 'clear':
          Store.clear();
          sendNotification({ message: 'Project data cleared.' });
          break;

        case 'ignore':
          sendNotification({ message: 'Error ignored. Your last change could not be saved.' });
          break;
      }

      return options.retry;
    },
    // AUTO SAVE
    async toggleAutoSave()
    {
      if (autoSave.value) {
        const result = await getConfirmation({
          title: 'Disable Auto Save',
          message: 'Your work will no longer be saved to your browser. Would you like to <b>clear</b> the data from your browser or <b>leave</b> it there for next time you visit?',
          confirm: 'Clear',
          unconfirm: 'Leave',
        });

        if (result) {
          Store.clear();
        }
      }

      autoSave.set(!autoSave.value);
    },
    // READONLY
    toggleReadOnly() 
    {
      this.readOnly = !this.readOnly;
    },
    // COMPLEXITY
    toggleComplexity() 
    {
      this.showComplexity = !this.showComplexity;
    },
    // RETURN EXPRESSIONS
    updateHighlightExpressions() 
    {
      const highlights = new Map();

      if (this.showReturnExpressions) 
      {
        const returns = this.program.traverse(Traverser.list<Expression>().filterClass(ReturnExpression));
        returns.forEach((expr) => {
          this.registry.getExpressionReturns(expr.value).forEach((highlight) => {
            highlights.set(highlight, this.showReturnColor);
          });
        });

        this.registry.getExpressionReturns(this.program).forEach((highlight) => {
          highlights.set(highlight, this.showReturnColor);
        });
      }

      this.highlightExpressions = highlights;
    },
    toggleShowReturnExpressions() 
    {
      this.showReturnExpressions = !this.showReturnExpressions;
    },
    // LOADING
    async loadable<R = any>(callback: () => R | Promise<R>): Promise<R | undefined>
    {
      let result: R | undefined;
      this.loading++;

      try
      {
        await this.$nextTick();

        result = await callback();
      }
      catch (e)
      {
        sendNotification({ message : 'There was an unexpected error: ' + e });
      }

      this.loading--;

      return result;
    },
    // EXAMPLES
    async loadExamples() 
    {
      this.loadable(async () => 
      {
        const response = await fetch('examples/index.json');
        const examples = await response.json();

        if (isArray(examples)) 
        {
          this.examples = examples;

          if (examples.length > 0) {
            const first = new TranscoderStore('first', {
              encode: (value: boolean) => value,
              decode: (data: boolean) => data,
              getDefault: () => true,
            });

            if (await first.load()) {
              this.showExamples = true;
              first.save(false);
            }
          }
        }
      });
    },
    async loadExample(url: string) 
    {
      this.loadable(async () => 
      {
        const response = await fetch(url);
        const data = await response.json();

        if (isObject(data) && data.type && data.settings && data.program) 
        {
          if (this.showExamples || await getConfirmation({ message: 'This will overwrite your current program, are you sure?' })) 
          {
            await this.importData(data);
          } 
          else 
          {
            sendNotification({ message: 'Importing example canceled.' });
          }
        } 
        else 
        {
          sendNotification({ message: 'This example seems corrupted, sorry!' });
        }

        this.showExamples = false;
      });
    },
    // SHARE
    share()
    {
      const name = this.metadata.title || '<Project Name>';
      const exported = JSON.stringify({
        metadata: this.store.metadata.encode(this.metadata),
        type: this.store.type.encode(this.type),
        settings: this.store.settings.encode(this.settings),
        data: this.store.data.encode(this.data),
        program: this.store.program.encode(this.program),
        functions: this.store.functions.encode(this.functions),
      });

      getSendMail({
        to: 'pdiffenderfer@gmail.com',
        subject: 'I would like to share my Expangine project with you',
        body: `Greetings!\nHere is an export of an Expangine project of mine, ${name}.\nYou can save this in a JSON file and import it into ${location.href}.\n\n\n${exported}`,
      });
    },
    // FUNCTIONS
    async addFunction() 
    {
      const { registry } = this;
      const result = await getEditFunction({ registry });

      if (result) 
      {
        this.saveDataPending();
        this.history.save({ functions: this.functions }, `Function ${result.name} added.`);
      }
    },
    async editFunction(name: string) 
    {
      const { registry } = this;
      const result = await getEditFunction({ registry, name });

      if (result) 
      {
        this.saveDataPending();
        this.history.save({ functions: this.functions }, `Function ${result.name} edited.`);
      }
    },
    async clearFunctions() 
    {
      if (await getConfirmation()) 
      {
        const functionsCleared = friendlyList(objectValues(this.functions, (_, name) => name));

        this.saveDataPending();
        this.history.save({ functions: {} }, `Functions cleared: ${functionsCleared}`);
      }
    },
    async saveAsFunction() 
    {
      const { type, registry, functions, program } = this;

      if (!(type instanceof ObjectType)) 
      {
        return sendNotification({ message: 'Save as Function requires the input to be an object.' });
      }

      const functionName = await getInput({ label: 'Function Name' });

      if (!functionName) 
      {
        return sendNotification({ message: 'Save as Function canceled' });
      }

      if (this.functions[functionName]) 
      {
        if (!await getConfirmation({ message: 'A function with that name already exists, overwrite it?' })) 
        {
          return sendNotification({ message: 'Save as Function canceled' });
        }
      }

      const params = registry.defs.cloneType(type) as ObjectType;
      const returnType = program.getType(registry.defs, params) || AnyType.baseType;
      const expression = program instanceof ReturnExpression
        ? registry.defs.cloneExpression(program)
        : new ReturnExpression(registry.defs.cloneExpression(program));
      
      const newFunction = new FunctionType({
        params,
        expression,
        returnType,
      });

      this.saveDataPending();
      this.$set(functions, functionName, newFunction);
      this.history.save({ functions }, `Saved program as function ${functionName}.`);
    },
    // TYPE & SETTINGS CHANGE
    handleChange(event: TypeUpdateEvent) 
    {
      window.console.log('change', event);

      const { type, settings, transform } = event;
      const saving: Partial<Project> = { type, settings };

      if (transform instanceof Expression)
      {
        const cmd = LiveRuntime.getCommand(transform);

        saving.data = cmd({ value: this.data });
      }

      this.saveDataPending();
      this.history.save(saving, transform ? 'Type, Settings, and Data change.' : 'Type and Settings change.');
    },
    // DESCRIBE
    async describe() 
    {
      const result = await getDescribeData({ registry: this.registry });

      if (result) 
      {
        this.saveDataPending();
        this.history.save(result, 'Detected data, type, and settings.');
      }
    },
    // RESET
    async reset() 
    {
      if (!await getConfirmation({ title: 'New Program', message: 'This will erase your design, data, program, and program information. Are you sure?' })) 
      {
        return;
      }

      const built = await this.getDefaultTypes();

      if (!built) 
      {
        return;
      }

      this.saveDataPending();
      this.history.save({
        type: built.type,
        settings: built.settings,
        data: this.store.data.getDefault(),
        metadata: this.store.metadata.getDefault(),
        program: this.store.program.getDefault(),
      }, 'Project reset.');
    },
    async getDefaultTypes(): Promise<TypeUpdateEvent | false> 
    {
      const builtOption = await DefaultBuilder.getOption({
        registry: this.registry,
      });

      return builtOption ? await builtOption.value() : false;
    },
    // EXPORT
    async exportJson() 
    {
      const exportResult = getProjectExport({
        project: this,
        transcoders: this.store,
      });

      if (isString(exportResult)) 
      {
        sendNotification({ message: exportResult });
      } 
      else 
      {
        sendNotification({ message: 'Project exported.' });
      }
    },
    // IMPORT CSV
    async importCsv() 
    {
      this.loadable(async () => 
      {
        const { registry, type } = this;
        const result = await getDataImport({ registry, type });

        if (isString(result))
        {
          sendNotification({ message: result });
        }
        else
        {
          this.saveDataPending();
          this.history.save(result.transform(this), 'Import CSV.');
        }
      });
    },
    // IMPORT JSON
    async importJson() 
    {
      this.loadable(async () => 
      {
        const result = await getFile({ accept: '.json', json: true });

        switch (result.status) {
          case FileImportStatus.SUCCESS:
            await this.importData(result.json, true);
            break;
          case FileImportStatus.NONE_SELECTED:
            sendNotification({ message: 'No file selected.' });
            break;
          case FileImportStatus.NOT_TEXT_FILE:
            sendNotification({ message: 'The file selected was not a valid file.' });
            break;
          case FileImportStatus.ERROR_PARSING_JSON:
            sendNotification({ message: 'The file selected did not contain a valid JSON value.' });
            break;
        }
      });
    },
    async importData(imported: any, customize: boolean = false) 
    {  
      const { type, registry, store: transcoders } = this;

      const importResult = await getProjectImport({
        imported,
        customize,
        accept: { type: true, settings: true, data: true, program: true, functions: true, metadata: true },  
        type,
        registry,
        transcoders,
      });

      if (isString(importResult)) 
      {
        sendNotification({ message: importResult });
      } 
      else 
      {
        const { importing, transform } = importResult;

        this.history.push(importing, () => {
          objectEach(transform, (transformer, prop) => {
            if (importing.indexOf(prop) !== -1) {
              this.store[prop].save(this[prop] = transformer(this));
            }
          });
        }, 'Imported Project.');
      }
    },
    // HISTORY
    historyUndo() 
    {
      this.saveDataPending();
      this.history.undo();
    },
    historyRedo() 
    {
      this.saveDataPending();
      this.history.redo();
    },
    async historyClear()
    {
      if (await getConfirmation())
      {
        this.saveDataPending();
        this.history.clear();
      }
    },
    updateHistoryData()
    {
      const history = this.history;
      const undo = history.getLastUndoDetails();
      const redo = history.getLastRedoDetails();

      this.undoEmpty = history.undos.length === 0;
      this.redoEmpty = history.redos.length === 0;
      this.historyEmpty = this.undoEmpty && this.redoEmpty;

      this.undoLabel = undo ? `Undo "${undo}"` : 'Undo the last change.';
      this.redoLabel = redo ? `Redo "${redo}"` : 'Redo the last undone change.';
    },
    // METADATA
    saveMetadata()
    {
      this.store.metadata.save(this.metadata);
    },
    // DATA SAVING
    saveDataDebounce() 
    {
      window.clearTimeout(this.dataTimeout);

      this.dataTimeout = window.setTimeout(() => {
        this.dataTimeout = -1;
        this.saveData();
      }, this.dataDebounce);
    },
    saveDataPending() 
    {
      if (this.dataTimeout !== -1) 
      {
        window.clearTimeout(this.dataTimeout);
        this.dataTimeout = -1;
        this.saveData();
      }
    },
    saveData() 
    {
      window.console.log('data saved');

      this.loadable(() => 
      {
        this.history.save({ data: this.data }, 'Data saved.');
      });
    },
    // PROGRAM
    saveProgram(program: Expression = NoExpression.instance) 
    {
      program.setParent();

      this.saveDataPending();
      this.history.save({ program }, 'Program saved.');

      this.updateHighlightExpressions();
    },
    resetProgram() 
    {
      this.saveProgram();
    },
    async runProgram() 
    {
      const { type, registry, program, data } = this;
      const useResults = this.useProgramResults;
      const useResultsLabel = 'Use results as the data for a new program';

      try 
      {
        await getRunProgram({ registry, type, program, data, useResults, useResultsLabel });
      } 
      catch (e) 
      {
        sendNotification({ message: 'There was an error in your program' });
        
        window.console.log(e);
      }
    },
    async useProgramResults(data: any): Promise<boolean> 
    {
      const { registry, type, history } = this;

      if (await getConfirmation({ message: 'This will overwrite your current data, are you sure?' })) 
      {
        const dataType = registry.defs.describe(data);
        const dataSettings = registry.getTypeSettings(dataType);

        if (type && type.acceptsData(dataType)) 
        {
          history.save({ data }, 'Saved program results as Data.');
        }
        else 
        {
          dataType.removeDescribedRestrictions();

          history.save({
            type: dataType,
            settings: dataSettings,
            data,
          }, 'Saved program results as Type, Settings, and Data.');
        }

        return true;
      }

      return false;
    },
    async debugProgram() 
    { 
      const { type, registry, program, data } = this;

      try 
      {
        await getDebugProgram({ registry, type, program, data });
      } 
      catch (e) 
      {
        sendNotification({ message: 'There was an error in your program' });
        
        window.console.log(e);
      }
    },
  },
});
</script>