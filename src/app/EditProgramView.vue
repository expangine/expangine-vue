<template>
  <div>
    <ex-namer
      v-if="!hideName"
      auto-validate
      :validate="validateName"
      :value="program.name"
      @input="renamed"
      @remove="remove"
    ></ex-namer>

    <v-tabs vertical icons-and-text background-color="grey lighten-3" v-model="tab">
      <v-tab>
        <v-icon>mdi-file-tree</v-icon>
        Design
      </v-tab>
      <v-tab>
        <v-icon>mdi-database-edit</v-icon>
        Input
      </v-tab>
      <v-tab>
        <v-icon>mdi-code-braces</v-icon>
        Program
      </v-tab>
      <v-tab>
        <v-icon>mdi-play</v-icon>
        Run
      </v-tab>
      <v-tab @click="onDebugSetup">
        <v-icon>mdi-bug</v-icon>
        Debug
      </v-tab>
      <v-tab>
        <v-icon>mdi-information-outline</v-icon>
        Info
      </v-tab>
      <v-tabs-items touchless v-model="tab">
        <v-tab-item>
          <ex-type-editor
            :read-only="readOnly"
            :type="program.dataType"
            :registry="registry"
            :settings="settings"
            @change="onChange"
          ></ex-type-editor>
        </v-tab-item>
        <v-tab-item>
          <div v-if="isSingleDataset">
            <v-btn right absolute rounded color="primary" class="mt-3" @click="addDataset">
              <v-icon>mdi-plus</v-icon> Add Alternative Input
            </v-btn>
            <div class="py-4"></div>
          </div>
          <div v-else>
            <v-tabs color="primary" show-arrows v-model="dataIndex">
              <v-tabs-slider></v-tabs-slider>
              <template v-for="(dataset, datasetIndex) in program.datasets">
                <v-tab :key="datasetIndex">
                  {{ dataset.name }}
                  <v-menu offset-y>
                    <template #activator="{ on }">
                      <v-btn icon small class="ml-2" v-on="on">
                        <v-icon small>mdi-settings</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-if="datasetIndex" @click="setPrimaryDataSet(dataset)">
                        <v-list-item-content>
                          <v-list-item-title>
                            Set as primary
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            When the program is ran in the program editor it will use this dataset.
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="renameDataset(dataset)">
                        <v-list-item-content>
                          <v-list-item-title>
                            Rename
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Change the name of the dataset.
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="copyDataset(dataset)">
                        <v-list-item-content>
                          <v-list-item-title>
                            Copy
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Copy this dataset to a new one.
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="removeDataset(dataset)">
                        <v-list-item-content>
                          <v-list-item-title>
                            Remove
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            Remove this dataset from the program.
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  
                </v-tab>
              </template>
            </v-tabs>
          </div>
          
          <ex-type-input
            :value="currentData"
            :type="program.dataType"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings"
            @input="onDataChange"
          ></ex-type-input>
        </v-tab-item>
        <v-tab-item>
          <ex-expression-editor
            vertical
            sticky
            can-remove
            hide-history
            :read-only="readOnly"
            :value="program.expression"
            :context="program.dataType"
            :registry="registry"
            :settings="settings"
            :data="currentData"
            @input="onProgramChange"
            @remove="onProgramRemove"
          ></ex-expression-editor>
        </v-tab-item>
        <v-tab-item>
          <div v-if="isRunVisible">
            <ex-run-program
              :program="program"
              :registry="registry"
            ></ex-run-program>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div v-if="isDebugVisible">
            <ex-debug-program
              hide-close
              sticky
              :debug="debug"
              :registry="registry"
            ></ex-debug-program>
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  outlined
                  hide-details
                  label="Author"
                  v-model="program.author"
                  @change="markUpdated"
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
                  v-model="program.description"
                  @change="markUpdated"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-chip label>
                  Created:&nbsp;<timeago :datetime="program.created"></timeago>
                </v-chip>
                <v-chip label class="ml-4">
                  Updated:&nbsp;<timeago :datetime="program.updated"></timeago>
                </v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { NoExpression, ObjectType, Expression, Program, ProgramDataSet, Entity, DataTypes } from 'expangine-runtime';
import { TypeUpdateEvent, TypeSettings } from '../runtime/types/TypeVisuals';
import { Preferences, PreferenceCategory } from './Preference';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';
import { Registry } from '../runtime/Registry';
import { System } from './SystemEvents';
import { ExplorerTab } from './explorer/ExplorerTypes';
import { Debugger, DebuggerOptions } from './Debugger';
import { now } from './StopWatch';
import { getInput } from './Input';
import { sendNotification } from './Notify';


const PREF_REMOVE_PROGRAM = Preferences.define({
  key: 'program_remove',
  label: 'Remove program without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

const PREF_REMOVE_DATASET = Preferences.define({
  key: 'program_dataset_remove',
  label: 'Remove program dataset without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    program: {
      type: Object as () => Program,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    hideName: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    id: Entity.uuid(),
    tab: 0,
    debug: null as null | Debugger,
    dataIndex: 0,
  }),
  computed: {
    settings(): TypeSettings {
      if (this.registry.getTypeSettingsValidFor(this.program.dataType, this.program.meta)) {
        return this.program.meta;
      }
      
      return this.program.meta = this.registry.getTypeSettings(this.program.dataType);
    },
    currentData(): any {
      return this.program.datasets[this.dataIndex].data;
    },
    isDebugVisible(): boolean {
      return this.tab === 4 && !!this.debug;
    },
    isRunVisible(): boolean {
      return this.tab === 3;
    },
    isSingleDataset(): boolean {
      return this.program.datasets.length === 1;
    },
  },
  methods: {
    renamed(newName: string) {
      const { registry, program } = this;
      const { defs } = registry;

      if (program.name) {
        if (defs.renameProgram(program.name, newName)) {
          this.$emit('renamed', this.program);
        } else {
          return;
        }
      } else {
        program.name = newName;

        defs.addProgram(program);
      }

      this.markUpdated();
    },
    validateName(name: string) {
      if (!name) {
        return 'A name is required.';
      }

      const existing = this.registry.defs.getProgram(name);
      if (existing && existing !== this.program) {
        return 'A function already exists with that name.';
      }

      return '';
    },
    async remove() {
      if (!await getConfirmation({ message: `Are you sure you want to remove this program?`, pref: PREF_REMOVE_PROGRAM })) {
        return;
      }

      this.registry.defs.removeProgram(this.program);

      this.$emit('removed', this.program);
    },
    onDebugSetup() {
      const { registry, program: { dataType: inputType, datasets, expression: program } } = this;
      const options: DebuggerOptions = {
        registry,
        inputType,
        input: datasets[this.dataIndex].data,
        program,
      };

      if (this.debug) {
        this.debug.set(options);
      } else {
        this.debug = new Debugger(options);
      }
    },
    onChange(event: TypeUpdateEvent) {
      this.program.dataType = event.type as ObjectType;
      this.program.meta = event.settings;

      if (event.transform) {
        this.program.refactor(event.transform, LiveRuntime);
      }

      this.markUpdated();
    },
    onProgramChange(program: Expression) {
      this.program.expression = program;
      this.markUpdated();
    },
    onProgramRemove() {
      this.program.expression = NoExpression.instance;
      this.markUpdated();
    },
    onDataChange(data: any) {
      this.program.updateDataset(this.dataIndex, {
        data,
        updated: now(),
      });
      this.markUpdated();
    },
    markUpdated(): void {
      this.program.changed();

      this.$emit('updated', this.program);
    },
    run() {
      const { program, registry } = this;
      const tab: ExplorerTab = {
        id: `run_${this.id}`,
        name: `Run ${this.program.name}`,
        icon: 'mdi-play',
        component: 'ex-run-program',
        bind: { registry, program },
        on: {},
        close: () => { /**/ },
      };

      System.forkTab(tab);
    },
    addDataset() {
      this.program.addDataset({
        name: 'Data Set #' + (this.program.datasets.length + 1),
        data: this.program.dataType.create(),
        created: now(),
        updated: now(),
        meta: null,
      });
      this.markUpdated();
    },
    async setPrimaryDataSet(dataset: ProgramDataSet) {      
      this.program.moveDataset(dataset, 0);
      this.dataIndex = 0;
      this.markUpdated();
    },
    async copyDataset(dataset: ProgramDataSet) {

      const name = await getInput({
        message: `Dataset name for copy of ${dataset.name}`,
        value: `${dataset.name} Copy`,
      });

      if (!name) {
        return sendNotification({ message: 'Dataset copy cancelled.' });
      }

      if (this.getDatasetByName(name)) {
        return sendNotification({ message: 'A dataset with that name already exists.' });
      }

      const copy: ProgramDataSet = {
        name,
        data: DataTypes.copy(dataset.data),
        created: now(),
        updated: now(),
        meta: DataTypes.copy(dataset.meta),
      };

      this.program.addDataset(copy);
      this.dataIndex = this.program.datasets.length - 1;
      this.markUpdated();
    },
    async renameDataset(dataset: ProgramDataSet) {
      const name = await getInput({
        message: `Dataset Name`,
        value: `${dataset.name}`,
      });

      if (!name) {
        return sendNotification({ message: 'Dataset rename cancelled.' });
      }

      if (this.getDatasetByName(name)) {
        return sendNotification({ message: 'A dataset with that name already exists.' });
      }

      this.program.updateDataset(dataset, { name });
      this.markUpdated();
    },
    async removeDataset(dataset: ProgramDataSet) {
      if (!await getConfirmation({ message: `Are you sure you want to remove this dataset?`, pref: PREF_REMOVE_DATASET })) {
        return;
      }

      this.program.removeDataset(dataset);

      if (this.dataIndex >= this.program.datasets.length) {
        this.dataIndex = this.program.datasets.length - 1;
      }
      this.markUpdated();
    },
    getDatasetByName(name: string): ProgramDataSet | undefined {
      return this.program.datasets.find((d) => d.name === name);
    },
  },
});
</script>