<template>
  <v-container fluid class="ex-markdown">
    <v-row no-gutters>
      <v-col v-if="columnMode">
        <v-tabs v-model="tab">
          <v-tab :key="1">
            View
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" class="pa-2">
            <vue-markdown
              v-bind="settings.options"
              :source="computedValue"
            ></vue-markdown>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col>
        <v-tabs v-model="tab">
          <v-tab :key="0" v-if="!columnMode">
            View
          </v-tab>
          <v-tab :key="1">
            Source
          </v-tab>
          <v-btn text absolute right class="align-self-center" @click="toggleColumnMode">
            <v-icon>mdi-file-compare</v-icon>
          </v-btn>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0" v-if="!columnMode" class="pa-2">
            <vue-markdown
              v-bind="settings.options"
              :source="computedValue"
            ></vue-markdown>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-textarea
              outlined
              auto-grow
              :label="settings.options.label"
              :placeholder="settings.options.placeholder"
              :hint="settings.options.hint"
              :hide-details="hideHint"
              :persistent-hint="hasHint"
              :readonly="readOnly"
              :error="invalid"
              v-model="computedValue"
            ></v-textarea>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import { TextMarkdownOptions } from './TextMarkdownTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<TextType, TextMarkdownOptions, string>(String).extend({
  name: 'TextMarkdown',
  data: () => ({
    tab: 0,
    columnMode: false,
  }),
  computed: {
    hasHint(): boolean {
      return !this.hideHint;
    },
    hideHint(): boolean {
      return !this.settings.options.hint;
    },
  },
  methods: {
    toggleColumnMode() {
      this.columnMode = !this.columnMode;
      this.tab = this.columnMode ? 1 : 0;
    },
  },
});
</script>