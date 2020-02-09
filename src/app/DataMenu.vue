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
            Posssible when the results contains an array of simple objects
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
import { Type, TypeBuilder, objectValues, ObjectType, ListType, isString, objectEach } from 'expangine-runtime';
import { Registry } from '../runtime/Registry';
import { exportFile } from './FileExport';
import { getInput } from './Input';
import { SystemEvents } from './SystemEvents';
import { sendNotification } from './Notify';
import { getPromiser } from './Promiser';
import { getDataExport } from './DataExport';
import { getSimpleInput } from './SimpleInput';


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
      return this.getCsvExportPaths().length > 0;
    },
    canExportOverwrite(): boolean {
      return SystemEvents.hasListeners('replaceData');
    },
  },
  methods: {
    async exportJson() {
      const { computedType } = this;

      if (computedType) {
        SystemEvents.trigger('loading', async () => {
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
          const content = JSON.stringify(computedType.toJson(this.data));

          exportFile({
            type: 'text/json',
            name,
            content,
          });
        });
      }
    },
    async exportJs() {
      const { computedType, registry } = this;

      if (computedType && registry) {
        SystemEvents.trigger('loading', async () => {
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
          const content = registry.getTypeStringify(computedType, this.data);

          exportFile({
            type: 'text/js',
            name,
            content,
          });
        });
      }
    },
    async exportCsv() {
      SystemEvents.trigger('loading', async () => 
      {
        const paths = this.getCsvExportPaths();
        let selected = paths.slice();

        if (paths.length > 1) 
        { 
          const chosen = await getSimpleInput({
            title: 'Export CSV',
            value: { path: selected as any },
            fields: [
              { name: 'path', type: 'combo', label: 'Choose what you want to export', required: true, 
                items: paths.map((value) => ({
                  text: value.join(' > '),
                  value,
                })),
              },
            ],
          });

          if (!chosen)
          {
            return sendNotification({ message: 'Export CSV canceled.' });
          }

          selected = chosen.path;
        }
        
        const registry = this.registry;

        for (const path of selected)
        {
          let data = this.data as any;
          let listType = this.computedType;

          for (const segment of path)
          {
            listType = (listType as ObjectType).options.props[segment];
            data = data[segment];
          }

          const itemType = (listType as ListType).options.item as ObjectType;
          const result = await getDataExport({ 
            registry, 
            data, 
            type: itemType,
            namePrefix: path.join('-'),
          });

          if (isString(result)) 
          {
            sendNotification({ message: result });
          }
        }
      });
    },
    getCsvExportPaths(): string[][] {
      const { csvType, computedType } = this;

      if (!csvType || !computedType) {
        return [];
      }

      if (csvType.acceptsType(computedType)) {
        return [[]];
      }

      const paths: string[][] = [];
      const types = [{ path: [] as string[], type: computedType }];

      while (types.length) {
        const next = types.pop();
        if (next) {
          const { type, path } = next;

          if (type instanceof ObjectType) {
            objectEach((type as ObjectType).options.props, (propType, prop) => {
              types.push({
                type: propType,
                path: path.slice().concat(prop),
              });
            });
          } else if (csvType.acceptsType(type)) {
            paths.push(path);
          }
        }
      }

      return paths;
    },
    exportOverwrite() {
      SystemEvents.trigger('replaceData', this.data);
    },
  },
});
</script>