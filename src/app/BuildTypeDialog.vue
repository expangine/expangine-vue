<template>
  <v-dialog v-model="visible" max-width="300">
    <v-card>
      <v-card-title 
        class="headline" 
        v-html="title"
      ></v-card-title>
      <v-card-text>
        <v-select
          solo
          filled
          return-object
          :value-comparator="compareStrict"
          :items="wrappers"
          v-model="wrapper"
        >
          <template #item="{ item, on, attrs }">
            <v-list-item v-on="on" v-bind="attrs">
              <v-list-item-content>
                <v-list-item-title 
                  v-html="item.text"
                ></v-list-item-title>
                <v-list-item-subtitle 
                  v-html="item.description"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
        <v-select
          solo
          filled
          return-object
          placeholder="- Select Type -"
          :hint="hint"
          :persistent-hint="persistentHint"
          :value-comparator="compareStrict"
          :items="options"
          :multiple="isMultiple"
          v-model="types"
        >
          <template #item="{ item, on, attrs }">
            <v-list-item v-on="on" v-bind="attrs">
              <v-list-item-icon v-if="isMultiple">
                {{ indexOf(item) }}
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title 
                  v-html="item.text"
                ></v-list-item-title>
                <v-list-item-subtitle 
                  v-html="item.description"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
        <v-switch
          inset
          hide-details
          label="Optional"
          v-model="optional"
        ></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          v-html="ok" 
          @click="handle(true)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="cancel" 
          @click="handle(false)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { buildTypeDialog } from './BuildType';
import { ListOptions, friendlyList, asArray } from '../common';
import { TypeVisuals } from '../runtime/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler, TypeBuilderWrapHandler, 
  TypeBuilderWrapOption } from '../runtime/TypeBuilder';


export default Vue.extend({
  data: () => buildTypeDialog,
  computed: {
    selectedTypes(): TypeBuildOption[] {
      return asArray(this.types);
    },
    hint(): string {
      return friendlyList(this.selectedTypes.map((t) => t.description || '').filter((d) => !!d));
    },
    persistentHint(): boolean {
      return !!this.hint;
    },
    allowsDuplicate(): boolean {
      return !!(this.wrapper && this.wrapper.allowDuplicates);
    },
    isMultiple(): boolean {
      return !!(this.wrapper && this.wrapper.multiple);
    },
  },
  methods: {
    compareStrict(a: any, b: any): boolean {
      return a === b;
    },
    indexOf(option: TypeBuildOption): string {
      const i = this.selectedTypes.indexOf(option);
      return i === -1 ? '' : `[${i}]`;
    },
  },
});
</script>