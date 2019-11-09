<template>
  <v-menu v-if="hasOptions" offset-y left>
    <template #activator="{ on }">
      <slot name="activator" :on="on">
        <v-btn v-on="on" v-bind="buttonProps">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-list dense> 
      <v-list-item v-if="canExportJson" @click="exportJson">
        <v-list-item-icon>
          <v-icon>mdi-json</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Save as JSON <span class="red--text">*</span></v-list-item-title>
          <v-list-item-subtitle>
            <span class="red--text">*</span> Some data types cannot be accurately represented in JSON
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="canExportJs" @click="exportJs">
        <v-list-item-icon>
          <v-icon>mdi-language-javascript</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Save as JS</v-list-item-title>
          <v-list-item-subtitle>
            All data types can accurately be represented in JS
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :disabled="!canExportCsv" @click="exportCsv">
        <v-list-item-icon>
          <v-icon>mdi-file-delimited-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Save as CSV</v-list-item-title>
          <v-list-item-subtitle>
            Posssible when the results are an array of simple objects
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="canExportOverwrite" @click="exportOverwrite">
        <v-list-item-icon>
          <v-icon>mdi-file-replace-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Overwrite Project</v-list-item-title>
          <v-list-item-subtitle>
            Replace current project data and possibly type
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
  <span v-else></span>
</template>

<script lang="ts">
import Vue from 'vue';
import * as Papa from 'papaparse';
import { Type, TypeBuilder, objectValues } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { exportFile } from './FileExport';
import { getInput } from './Input';
import { SystemEvents } from './SystemEvents';
import { sendNotification } from './Notify';


export default Vue.extend({
  props: {
    data: {
      required: true,
    },
    registry: {
      type: Object as () => Registry,
    },
    type: {
      type: Object as () => Type | null,
      default: null,
    },
    buttonProps: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    computedType(): Type | null {
      return this.type || (this.registry && this.registry.defs.describe(this.data)) || null;
    },
    csvType(): Type | null {
      if (!this.registry) {
        return null;
      }

      const simples = this.registry.defs.getSimpleTypes();
      const tp = new TypeBuilder();

      return tp.list(
        tp.object({
          '*': tp.many(
            tp.optional(tp.many(...simples)),
            ...simples,
          ),
        },
      ));
    },
    hasOptions(): boolean {
      return this.canExportJson || this.canExportJs || this.canExportCsv || this.canExportOverwrite;
    },
    canExportJson(): boolean {
      return !!this.computedType;
    },
    canExportJs(): boolean {
      return !!this.computedType;
    },
    canExportCsv(): boolean {
      return !!(this.csvType && this.computedType && this.csvType.acceptsType(this.computedType));
    },
    canExportOverwrite(): boolean {
      return SystemEvents.hasListeners('replaceData');
    },
  },
  methods: {
    async exportJson() {
      if (this.computedType) {
        const filename = await getInput({ 
          title: 'Save as JSON',
          message: 'Enter a filename (without .json extension)',
          value: 'json-' + Date.now(),
          label: 'Filename',
        });

        if (!filename) {
          return sendNotification({ message: 'Save as JSON canceled.' });
        }

        const name = filename + '.json';
        const content = JSON.stringify(this.computedType.toJson(this.data));

        exportFile({
          type: 'text/json',
          name,
          content,
        });
      }
    },
    async exportJs() {
      if (this.computedType && this.registry) {
        const filename = await getInput({ 
          title: 'Save as JS',
          message: 'Enter a filename (without .js extension)',
          value: 'js-' + Date.now(),
          label: 'Filename',
        });

        if (!filename) {
          return sendNotification({ message: 'Save as JS canceled.' });
        }

        const name = filename + '.js';
        const content = this.registry.getTypeStringify(this.computedType, this.data);

        exportFile({
          type: 'text/js',
          name,
          content,
        });
      }
    },
    async exportCsv() {
      if (this.computedType) {
        const filename = await getInput({ 
          title: 'Save as CSV',
          message: 'Enter a filename (without .csv extension)',
          value: 'csv-' + Date.now(),
          label: 'Filename',
        });

        if (!filename) {
          return sendNotification({ message: 'Save as CSV canceled.' });
        }

        const name = filename + '.csv';
        const content = Papa.unparse(this.data as object[]);

        exportFile({
          type: 'text/csv',
          name,
          content,
        });
      }
    },
    exportOverwrite() {
      SystemEvents.trigger('replaceData', this.data);
    },
  },
});
</script>