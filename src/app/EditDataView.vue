<template>
  <div>
    <ex-namer
      v-if="!hideName"
      auto-validate
      :validate="validateName"
      :value="data.name"
      @input="renamed"
      @remove="remove"
    ></ex-namer>

    <v-tabs vertical icons-and-text background-color="grey lighten-3">
      <v-tab>
        <v-icon>mdi-database-edit</v-icon>
        Data
      </v-tab>
      <v-tab>
        <v-icon>mdi-file-tree</v-icon>
        Type
      </v-tab>
      <v-tab>
        <v-icon>mdi-information-outline</v-icon>
        Info
      </v-tab>
      <v-tab>
        <v-icon>mdi-swap-horizontal-bold</v-icon>
        Refs
      </v-tab>
      <v-tab-item>
        <ex-type-input
          :value="data.data"
          :type="data.dataType"
          :read-only="readOnly"
          :registry="registry"
          :settings="settings"
          @input="onDataChange"
        ></ex-type-input>
      </v-tab-item>
      <v-tab-item>
        <ex-type-editor
          :read-only="readOnly"
          :type="data.dataType"
          :registry="registry"
          :settings="settings"
          @change="onChange"
        ></ex-type-editor>
      </v-tab-item>
      <v-tab-item>
        <v-container>
          <v-row>
            <v-col>
              <v-chip label>
                Created:&nbsp;<timeago :datetime="data.created"></timeago>
              </v-chip>
              <v-chip label class="ml-4">
                Updated:&nbsp;<timeago :datetime="data.updated"></timeago>
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <v-tab-item>
        <p v-if="references.length === 0" class="pa-3">
          <v-alert type="info">
            This Data is not referenced by anything.
          </v-alert>
        </p>
        <v-list dense v-else>
          <template v-for="(ref, index) in references">
            <ex-definitions-reference 
              :key="index"
              :reference="ref" 
              :registry="registry"
            ></ex-definitions-reference>
          </template>
        </v-list>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ObjectType, ReferenceData, DefinitionsDataReference } from 'expangine-runtime';
import { TypeUpdateEvent, TypeSettings } from '../runtime/types/TypeVisuals';
import { Preferences, PreferenceCategory } from './Preference';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';
import { Registry } from '../runtime/Registry';
import { sendNotification } from './Notify';


const PREF_REMOVE_DATA = Preferences.define({
  key: 'data_remove',
  label: 'Remove data without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    data: {
      type: Object as () => ReferenceData,
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
  computed: {
    settings(): TypeSettings {
      if (this.registry.getTypeSettingsValidFor(this.data.dataType, this.data.meta)) {
        return this.data.meta;
      }
      
      return this.data.meta = this.registry.getTypeSettings(this.data.dataType);
    },
    references(): DefinitionsDataReference[] {
      return this.registry.defs.getDataReferences(this.data);
    },
  },
  methods: {
    renamed(newName: string) {
      const { registry, data } = this;
      const { defs } = registry;

      if (data.name) {
        const updates = defs.renameData(data.name, newName);
        
        if (updates && updates.length) {
          sendNotification({ message: `${updates.length} Data reference(s) updated` });
        }
        
        this.$emit('renamed', this.data);
      } else {
        data.name = newName;

        defs.addData(data);
      }
    },
    validateName(name: string) {
      if (!name) {
        return 'A name is required.';
      }

      const existing = this.registry.defs.getData(name);
      if (existing && existing !== this.data) {
        return 'Data already exists with that name.';
      }

      return '';
    },
    async remove() {
      if (!await getConfirmation({ message: `Are you sure you want to remove this data?`, pref: PREF_REMOVE_DATA })) {
        return;
      }

      const removed = this.registry.defs.removeData(this.data);

      if (!removed) {
        sendNotification({ message: 'You cannot remove referenced data.' });
      } else {
        this.$emit('removed', this.data);
      }
    },
    onChange(event: TypeUpdateEvent) {
      this.data.dataType = event.type as ObjectType;
      this.data.meta = event.settings;

      if (event.transform) {
        this.data.refactor(event.transform, LiveRuntime);
      }
    },
    onDataChange(data: any) {
      this.data.data = data;
    },
  },
});
</script>