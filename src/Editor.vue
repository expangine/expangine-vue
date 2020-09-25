<template>
  <div v-shortcuts.document="shortcuts" class="expangine-app">

    <v-navigation-drawer app clipped dark disable-resize-watcher :permanent="explorerVisible" width="300" v-model="explorerVisible">

      <v-text-field
        filled
        dense
        solo
        flat
        single-line
        hide-details
        clearable
        class="ma-2"
        append-icon="mdi-magnify"
        :placeholder="explorerSearchPlaceholder"
        v-model="explorerSearch"
        v-focus-on-change="[explorerSearchFocuses, 'input']"
      ></v-text-field>

      <v-list dark dense class="pa-0">
        <ex-explorer-program-folder
          :name-filter="explorerSearch"
          :registry="registry"
          @open="openTab"
          @close="closeTab"
        ></ex-explorer-program-folder>  
        <ex-explorer-data-folder
          :name-filter="explorerSearch"
          :registry="registry"
          @open="openTab"
          @close="closeTab"
        ></ex-explorer-data-folder>  
        <ex-explorer-function-folder
          :name-filter="explorerSearch"
          :registry="registry"
          @open="openTab"
          @close="closeTab"
        ></ex-explorer-function-folder>  
        <ex-explorer-entity-folder
          :name-filter="explorerSearch"
          :registry="registry"
          @open="openTab"
          @close="closeTab"
        ></ex-explorer-entity-folder>  
        <ex-explorer-relation-folder
          :name-filter="explorerSearch"
          :registry="registry"
          @open="openTab"
          @close="closeTab"
        ></ex-explorer-relation-folder>  
      </v-list>

    </v-navigation-drawer>

    <v-app-bar app dense elevate-on-scroll color="primary" dark clipped-left>
      <v-menu offset-y close-on-content-click>
        <template #activator="{ on }">
          <v-btn text v-on="on">
            File
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="importJson">
            <v-list-item-icon>
              <v-icon>mdi-import</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Open
                <ex-shortcut-label pref="shortcut_open"></ex-shortcut-label>
              </v-list-item-title>
              <v-list-item-subtitle>Upload a project JSON file.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="exportJson">
            <v-list-item-icon>
              <v-icon>mdi-export</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Save
                <ex-shortcut-label pref="shortcut_save"></ex-shortcut-label>
              </v-list-item-title>
              <v-list-item-subtitle>Download project as a JSON file.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="share">
            <v-list-item-icon>
              <v-icon>mdi-share</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Share</v-list-item-title>
              <v-list-item-subtitle>Share your project with a friend, if you know the password.</v-list-item-subtitle>
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
              <v-list-item-title>
                New Project
                <ex-shortcut-label pref="shortcut_new"></ex-shortcut-label>
              </v-list-item-title>
              <v-list-item-subtitle>You can clear out or reuse any existing work.</v-list-item-subtitle>
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
          <v-list-item @click="historyUndo" :disabled="!undos.length">
            <v-list-item-icon>
              <v-icon>mdi-undo</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Undo
                <ex-shortcut-label pref="shortcut_undo"></ex-shortcut-label>
              </v-list-item-title>
              <v-list-item-subtitle>{{ undos.length }} changes.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="historyRedo" :disabled="!redos.length">
            <v-list-item-icon>
              <v-icon>mdi-redo</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Redo
                <ex-shortcut-label pref="shortcut_redo"></ex-shortcut-label>
              </v-list-item-title>
              <v-list-item-subtitle>{{ redos.length }} undone changes.</v-list-item-subtitle>
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
          <v-divider></v-divider>
          <v-list-item @click="preferences = true">
            <v-list-item-icon>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Preferences</v-list-item-title>
              <v-list-item-subtitle>View and edit all editor preferences.</v-list-item-subtitle>
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
          <v-list-item @click="showOperations = true">
            <v-list-item-icon>
              <v-icon>mdi-file-document-box-search-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Operation Explorer
                <ex-shortcut-label pref="shortcut_operations"></ex-shortcut-label>
              </v-list-item-title>
              <v-list-item-subtitle>Search through the list of available operations.</v-list-item-subtitle>
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
          <v-list-item @click="toggleExplorerVisible">
            <v-list-item-icon>
              <v-icon>mdi-file-tree</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ explorerVisible ? 'Hide' : 'Show' }} Explorer</v-list-item-title>
              <v-list-item-subtitle>Toggle the project explorer on the left.</v-list-item-subtitle>
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

      <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        absolute
        bottom
        color="blue darken-1"
      ></v-progress-linear>

    </v-app-bar>

    <v-main>
      
      <v-tabs dark show-arrows v-model="currentTab">
        <v-tabs-slider></v-tabs-slider>
        <template v-for="(tab, tabIndex) in tabs">
          <v-tab :key="tabIndex">
            <v-icon small class="mr-2">
              {{ tab.icon }}
            </v-icon>
            {{ tab.name }}
            <v-btn icon small class="ml-2" @click.stop.prevent="tab.close"> <!-- removeTab(tabIndex) -->
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </v-tab>
        </template>
      </v-tabs>

      <div v-if="!initialized" class="pa-3">
        <v-skeleton-loader
          type="list-item-avatar-three-line"
        ></v-skeleton-loader>
      </div>

      <v-tabs-items 
        v-else-if="tabs.length > 0"
        touchless
        class="explorer-tabs"
        v-model="currentTab">
        <template v-for="(tab, tabIndex) in tabs">
          <v-tab-item :key="tabIndex">
            <component
              :is="tab.component"
              v-bind="tab.bind"
              v-on="tab.listeners"
            ></component>
          </v-tab-item>
        </template>
      </v-tabs-items>

      <div v-else>

        <v-alert
          prominent
          colored-border
          border="left"
          color="primary"
          elevation="2"
          icon="mdi-arrow-left-bold"
          class="ma-4"
        >
          <v-row align="center">
            <v-col class="grow">
              You don't have anything open. Try an example or create something.
            </v-col>
            <v-col class="shrink">
              <v-btn large dark color="primary" href="https://youtu.be/c_E06eNWg70" target="_blank">
                Intro Video
                <v-icon right>mdi-open-in-new</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      
        <v-list class="ma-4">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-code-braces</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Programs
              </v-list-item-title>
              <v-list-item-subtitle>
                Programs have input data and runs code to produce output.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-database</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Data
              </v-list-item-title>
              <v-list-item-subtitle>
                Data can be accessed by any program or function through the <strong>Get Data</strong> expression.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-function</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Functions
              </v-list-item-title>
              <v-list-item-subtitle>
                Functions take parameters and runs code on them to return a result. They can be invoked throught he <strong>Invoke</strong> expression.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cube-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Types
              </v-list-item-title>
              <v-list-item-subtitle>
                A type is user-defined object. Optionally they can be stored more efficiently than normal data and can have relationships with other types.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-axis-arrow</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Relations
              </v-list-item-title>
              <v-list-item-subtitle>
                A relation describes how two Types can be related to each other.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      
      <ex-operation-catalogue-dialog
        :registry="registry"
        :show.sync="showOperations"
      ></ex-operation-catalogue-dialog>

      <ex-preference-dialog
        :registry="registry"
        v-model="preferences"
      ></ex-preference-dialog>

      <v-dialog v-model="showExamples" max-width="800" :fullscreen="$vuetify.breakpoint.mdAndDown">
        <v-card>
          <v-card-title class="headline">
            Welcome to Expangine!
          </v-card-title>
          <v-card-text>
            Expangine is a visual development framework. 
            It's a series of TypeScript/JS libraries which provide data type functionality and operations as well as runtimes which convert your operations and programs into any desired output. At the moment the only runtime is one that executes the program you've developed in the browser (or NodeJS). Potential runtimes could convert your program into any Programming Language or into a series of SQL commands.
            <strong>expangine-vue</strong> is the component library built using Vue &amp; Vuetify. This is just an example interface, any interface could be used to create programs and types.
          </v-card-text>
          <v-card-text>
            If you experience any problems or would like to provide feed back you can <a href="mailto:pdiffenderfer@gmail.com" target="_blank" rel="noopener">here</a> or on <a href="https://github.com/expangine/expangine-vue" target="_blank" rel="noopener">GitHub</a>.
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
      >
        <v-list dense subheader>
          <template v-for="(redo, index) in redos">
            <v-list-item :key="`redo${index}`" @click="gotoRedo(index)">
              <v-list-item-content>
                <v-list-item-title>
                  <timeago :datetime="redo.time"></timeago>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ redo.patch.length }} bytes changed.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-divider></v-divider>
          <v-subheader>Current State</v-subheader>
          <v-divider></v-divider>
          <template v-for="(undo, index) in undosReversed">
            <v-list-item :key="`undo${index}`" @click="gotoUndo(index)">
              <v-list-item-content>
                <v-list-item-title>
                  <timeago :datetime="undo.time"></timeago>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ undo.patch.length }} bytes changed.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>  
      </v-navigation-drawer>

    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { defs, isString, isObject, isArray, DefinitionsImportOptions } from 'expangine-runtime';
import { getConfirmation } from './app/Confirm';
import { sendNotification } from './app/Notify';
import { getRunProgram } from './app/RunProgram';
import { getDebugProgram } from './app/DebugProgram';
import { DefinitionsSaver, DefinitionsPatch } from './app/DefinitionsSaver';
import { getSimpleInput } from './app/SimpleInput';
import { getFile, FileImportStatus } from './app/FileImport';
import { getProjectImport } from './app/ProjectImport';
import { getProjectExport } from './app/ProjectExport';
import { System } from './app/SystemEvents';
import { Preferences, PreferenceCategory } from './app/Preference';
import { ShortcutContext, Shortcuts } from './app/Shortcuts';
import { ExplorerTab } from './app/explorer/ExplorerTypes';
import { addEntity } from './app/EntityBuilders';
import { getInput } from './app/Input';
import { clearEntity } from './app/EntityBuilders';
import Registry from './runtime';



const PREF_DISABLE_AUTO_SAVE = Preferences.define({
  key: 'disable_auto_save',
  label: 'Disable auto save without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_EXAMPLE_OVERWRITE = Preferences.define({
  key: 'example_overwrite',
  label: 'Overwrite project with examples without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_CLEAR_HISTORY = Preferences.define({
  key: 'clear_history',
  label: 'Clear undo/redo history without confirmation',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_AUTO_SAVE = Preferences.define({
  key: 'auto_save',
  label: 'Auto-save project',
  category: [PreferenceCategory.EDITOR],
  defaultValue: true,
});

const PREF_SHORTCUT_SAVE = Preferences.define({
  key: 'shortcut_save',
  label: 'Save shortcut',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.SHORTCUT],
  defaultValue: '83__c',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_OPEN = Preferences.define({
  key: 'shortcut_open',
  label: 'Open shortcut',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.SHORTCUT],
  defaultValue: '79__c',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_UNDO = Preferences.define({
  key: 'shortcut_undo',
  label: 'Undo shortcut',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.SHORTCUT],
  defaultValue: '90__c',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_REDO = Preferences.define({
  key: 'shortcut_redo',
  label: 'Redo shortcut',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.SHORTCUT],
  defaultValue: '90_sc',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_NEW = Preferences.define({
  key: 'shortcut_new',
  label: 'New Project shortcut',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.SHORTCUT],
  defaultValue: '78__c',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_OPERATIONS = Preferences.define({
  key: 'shortcut_operations',
  label: 'Operation Explorer shortcut',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.SHORTCUT],
  defaultValue: '79_sc',
  component: 'ex-shortcut-input',
});

const PREF_SHORTCUT_EXPLORER_SEARCH = Preferences.define({
  key: 'shortcut_explorer_search',
  label: 'Focus on explorer search',
  category: [PreferenceCategory.EDITOR, PreferenceCategory.SHORTCUT],
  defaultValue: '70_sc',
  component: 'ex-shortcut-input',
});

const PREF_SHOW_EXAMPLES = Preferences.define({
  key: 'first',
  label: 'Show examples dialogue on startup',
  category: [PreferenceCategory.EDITOR],
  defaultValue: true,
});


const saver = new DefinitionsSaver(Registry.defs);

export default Vue.extend({
  name: 'Editor',
  data: () => ({
    registry: Registry,
    // Editor Properties
    initialized: false,
    autoSave: Preferences.get(PREF_AUTO_SAVE),
    mode: 0,
    examples: [] as any[],
    showExamples: false,
    dataDebounce: 60 * 1000,
    dataTimeout: -1,
    loading: 0,
    showOperations: false,
    preferences: false,
    // History
    undos: saver.undos,
    redos: saver.redos,
    historyDrawer: false,
    // Preferences
    prefs: Preferences.values,
    // Explorer
    explorerSearch: '',
    explorerSearchFocuses: 0,
    currentTab: -1,
    tabs: [] as ExplorerTab[],
    explorerVisible: true,
  }),
  computed: 
  {
    historyEmpty(): boolean {
      return this.undos.length === 0 && this.redos.length === 0;
    },
    undosReversed(): DefinitionsPatch[] {
      return this.undos.slice().reverse();
    },
    shortcuts(): ShortcutContext {
      return {
        id: 'app',
        downs: {
          [Preferences.get(PREF_SHORTCUT_SAVE)]: this.exportJson,
          [Preferences.get(PREF_SHORTCUT_OPEN)]: this.importJson,
          [Preferences.get(PREF_SHORTCUT_NEW)]: this.reset,
          [Preferences.get(PREF_SHORTCUT_UNDO)]: this.historyUndo,
          [Preferences.get(PREF_SHORTCUT_REDO)]: this.historyRedo,
          [Preferences.get(PREF_SHORTCUT_OPERATIONS)]: () => this.showOperations = true,
          [Preferences.get(PREF_SHORTCUT_EXPLORER_SEARCH)]: () => this.explorerSearchFocuses++,
        },
        ups: {

        },
      };
    },
    hasExamples(): boolean {
      return this.examples.length > 0;
    },
    isLoading(): boolean {
      return this.loading > 0;
    },
    isDataSaved(): boolean {
      return this.dataTimeout === -1;
    },
    explorerSearchPlaceholder(): string {
      const shortcut = Shortcuts.nameFromCode(Preferences.get(PREF_SHORTCUT_EXPLORER_SEARCH));

      return `Search (${shortcut})`;
    },
  },
  async mounted() 
  {
    System.off('loading').on('loading', this.handleLoading);
    System.off('openTab').on('openTab', (type, tab) => this.openTab(tab));
    System.off('closeTab').on('closeTab', (type, tab) => this.closeTab(tab));

    let loaded = false;
    const shareName = window.location.href.match(/share=([^&]*)/);
    if (shareName && shareName[1]) {
      window.history.replaceState({}, document.title, window.location.href.split('?')[0]);

      try {
        const shareResponse = await fetch('shares/' + shareName[1]);

        if (shareResponse.ok) {
          const shareData = await shareResponse.json();

          await saver.clear();

          this.registry.defs.sync(shareData as DefinitionsImportOptions);
          loaded = true;
        }
      } catch (e) {
        window.console.log('share load error', e);
      }
    }
    if (!loaded) {
      await saver.load();
    }
    
    this.loadExamples();
    
    this.registry.defs.entities.forEach((_, entityName) => addEntity(this.registry, entityName));

    this.initialized = true;
  },
  methods: 
  {
    openTab(tab: ExplorerTab) 
    {
      const i = this.tabs.findIndex((t) => t.id === tab.id);
      if (i === -1) {
        this.currentTab = this.tabs.length;
        this.tabs.push(tab);
      } else {
        this.currentTab = i;
      }
    },
    closeTab(tab: ExplorerTab) 
    {
      const i = this.tabs.findIndex((t) => t.id === tab.id);
      if (i !== -1) {
        this.tabs.splice(i, 1);
        if (this.currentTab >= this.tabs.length) {
          this.currentTab = this.tabs.length - 1;
        }
      }
    },
    async historyUndo() 
    {
      this.loadable(() => saver.undo());
    },
    async gotoUndo(index: number) 
    {
      this.loadable(() => saver.undoMany(index + 1));
    },
    async historyRedo() 
    {
      this.loadable(() => saver.redo());
    },
    async gotoRedo(index: number) 
    {
      this.loadable(() => saver.redoMany(this.redos.length - index));
    },
    async historyClear() 
    {
      if (await getConfirmation({ pref: PREF_CLEAR_HISTORY })) 
      {
        this.loadable(() => saver.clear());
      }
    },
    async toggleAutoSave()
    {
      if (this.autoSave) {
        await getConfirmation({
          title: 'Disable Auto Save',
          message: 'Your work will no longer be saved to your browser. Would you like to <b>clear</b> the data from your browser or <b>leave</b> it there for next time you visit?',
          confirm: 'Clear',
          unconfirm: 'Leave',
          pref: PREF_DISABLE_AUTO_SAVE,
        });
      }

      this.autoSave = !this.autoSave;

      Preferences.set(PREF_AUTO_SAVE, this.autoSave);
    },
    toggleExplorerVisible()
    {
      this.explorerVisible = !this.explorerVisible;
    },
    async handleLoading(eventType: 'loading', loadable: () => Promise<any>)
    {
      this.loadable(loadable);
    },
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

        window.console.log('error in loadable', e);
      }

      this.loading--;

      return result;
    },
    async loadExamples() 
    {
      this.loadable(async () => 
      {
        const response = await fetch('examples/index.json');
        const examples = await response.json();

        if (isArray(examples)) 
        {
          this.examples = examples;

          if (!saver.loaded && examples.length > 0 && Preferences.get(PREF_SHOW_EXAMPLES)) {
            this.showExamples = true;
            
            Preferences.set(PREF_SHOW_EXAMPLES, false);
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
          if (this.showExamples || await getConfirmation({ message: 'This will overwrite your current program, are you sure?', pref: PREF_EXAMPLE_OVERWRITE })) 
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
    async share()
    {
      const name = await getInput({ title: 'Share Name', matches: /^[\w-]+$/i });

      if (!name) {
        return;
      }

      const secret = await getInput({ title: 'Share Password', message: 'If you are not sure what the password is, ask The Creator.' });

      if (!secret) {
        return;
      }

      const data = JSON.stringify(this.registry.defs.export());

      const formData = new FormData();
      formData.append('name', name);
      formData.append('secret', secret);
      formData.append('data', data);

      const response = await fetch('api/share.php', {
        method: 'post',
        body: formData,
      });

      const result = await response.json();

      if (result) {
        await getInput({ message: 'Project shared!', value: window.location + 'shared/' + name + '?program=' + this.registry.defs.programs.keys[0] });
      } else {
        await sendNotification({ message: 'Sorry, either the password was incorrect or the name is already taken.' });
      }
    },
    async reset() 
    {
      const resetting = await getSimpleInput({
        title: 'New Project',
        value: {
          programs: true,
          functions: true,
          data: true,
          types: true,
        },
        fields: [
          { name: 'programs', type: 'boolean', label: 'Programs?' },
          { name: 'functions', type: 'boolean', label: 'Functions?' },
          { name: 'data', type: 'boolean', label: 'Data?' },
          { name: 'types', type: 'boolean', label: 'Types & Relations?' },
        ],
      });

      if (!resetting)
      {
        return await sendNotification({ message: 'Reset canceled.' });
      }

      
      if (resetting.programs)
      {
        this.registry.defs.clearPrograms();
      }

      if (resetting.data)
      {
        this.registry.defs.clearData();
      }

      if (resetting.functions)
      {
        this.registry.defs.clearFunctions();
      }

      if (resetting.types)
      {
        this.registry.defs.clearEntities();
        this.registry.defs.clearRelations();

        clearEntity(this.registry);
      }
    },
    async exportJson() 
    {
      const exportResult = await getProjectExport({
        defs: this.registry.defs,
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
      const { registry } = this;

      const importResult = await getProjectImport({
        imported,
        customize,
        registry,
      });

      if (isString(importResult)) 
      {
        sendNotification({ message: importResult });
      }
    },
    async runProgram() 
    {
      const registry = this.registry;
      const program = defs.programs.values[0];

      try
      {
        await getRunProgram({ registry, program });
      } 
      catch (e) 
      {
        sendNotification({ message: 'There was an error in your program' });
        
        window.console.log('error in run program', e);
      }
    },
    async debugProgram() 
    { 
      const registry = this.registry;
      const currentProgram = defs.programs.values[0];
      const { expression: program, dataType: type, datasets } = currentProgram;

      try 
      {
        await getDebugProgram({ registry, type, program, data: datasets[0].data });
      } 
      catch (e) 
      {
        sendNotification({ message: 'There was an error in your program' });
        
        window.console.log('error in debug program', e);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.expangine-app /deep/ {
  height: 100%;

  .v-tabs /deep/ .v-item-group {
    background-color: #757575 !important;

    .v-tab {
      text-transform: none !important;
      font-family: Roboto, sans-serif;
      letter-spacing: initial;
      font-size: 16px;
    }
  }

  > .v-main {
    height: 100%;
  }
}

.explorer-tabs {
  position: absolute;
  top: 48px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: scroll;
}
</style>