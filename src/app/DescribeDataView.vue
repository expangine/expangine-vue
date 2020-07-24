<template>
  <v-tabs>
    <v-tab>Input</v-tab>
    <v-tab v-if="type">Type</v-tab>
    <v-tab v-if="type">Data</v-tab>

    <v-spacer></v-spacer>

    <v-checkbox
      v-if="!hideRemoveRestrictions"
      hide-details
      class="mt-0 ma-2"
      v-model="removeDescribedRestrictions"
      label="Remove Detected Restrictions"
    ></v-checkbox>

    <v-btn 
      v-if="canDetect"
      color="primary"
      @click="determineType"
    >{{ labelDetect }}</v-btn>

    <v-btn 
      v-if="canLoad"
      class="ml-3"
      color="primary"
      @click="load"
    >{{ labelLoad }}</v-btn>

    <v-tab-item class="data-container">
      <v-textarea
        solo
        flat
        filled
        hide-details
        height="100%"
        placeholder="Paste your JS code or JSON here"
        v-focus-on-create="'textarea'"
        v-model="input"
      ></v-textarea>
    </v-tab-item>

    <v-tab-item class="data-container" v-if="type">
      <ex-type-editor
        :type="type"
        :registry="registry"
        :settings="settings"
        @change="onChange"
      ></ex-type-editor>
    </v-tab-item>

    <v-tab-item class="data-container" v-if="data">
      <ex-type-input
        v-model="data"
        :type="dataType"
        :registry="registry"
        :settings="settings"
      ></ex-type-input>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { TypeSettings, TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { sendNotification } from './Notify';
import { Registry } from '../runtime/Registry';


export default Vue.extend({
  props: {
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    labelDetect: {
      type: String,
      default: 'Detect',
    },
    labelLoad: {
      type: String,
      default: 'Load',
    },
    hideRemoveRestrictions: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    type: null as null | Type,
    settings: null as null | TypeSettings,
    input: '',
    data: null as any,
    removeDescribedRestrictions: true,
  }),
  computed: {
    isRemoveRestrictions() {
      return this.removeDescribedRestrictions || this.hideRemoveRestrictions;
    },
    canDetect(): boolean {
      return !!this.input;
    },
    canLoad(): boolean {
      return !!(this.input && this.type);
    },
    dataType(): Type | null {
      if (!this.type || !this.removeDescribedRestrictions) {
        return this.type;
      }
      const removed = this.type.clone();
      removed.removeDescribedRestrictions();
      return removed;
    },
  }, 
  methods: {
    determineType() {
      const firstVarRegex = /(var\s+|const\s+|let\s+|)([$a-z_][$a-z_0-9]*)\s*=/gi;
      const firstVarMatch = firstVarRegex.exec(this.input);
      let result;
      let error;

      if (firstVarMatch) {
        const firstVar = firstVarMatch[2];

        try {
          result = new Function(this.input + ' return ' + firstVar)();
        } catch (e) {
          error = e;
        }
      } else {
        try {
          result = new Function('return ' + this.input)();
        } catch (e) {
          error = e;
        }
      }

      if (result !== undefined) 
      {
        this.data = result;
        this.type = this.registry.defs.describe(this.data);
        this.settings = this.registry.getTypeSettings(this.type);
      } 
      else if (error) 
      {
        sendNotification({ message: error });
      } 
      else 
      {
        sendNotification({ message: 'There was an unexpected problem detecting data.' });
      }
    },
    load() {
      const { type, data, settings } = this;

      if (type && this.isRemoveRestrictions) {
        type.removeDescribedRestrictions();
      }

      this.$emit('load', { type, data, settings });
    },
    onChange(event: TypeUpdateEvent) {
      this.type = event.type;
      this.settings = event.settings;
      
      if (event.transform) {
        const command = LiveRuntime.getCommand(event.transform);
        this.data = command({ value: this.data });
      }
    },
  },
});
</script>

<style lang="less" scoped>
.data-container {
  position: relative;
  height: calc(100vh - 300px);
  overflow: scroll;
}

.v-textarea {
  height: 100%;

  /deep/ .v-input__control {
    height: 100%;

    .v-text-field__slot {
      overflow: hidden;

      textarea {
        height: 100%;
      }
    }
  }
}
</style>