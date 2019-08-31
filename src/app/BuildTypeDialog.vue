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
          placeholder="- Select Type -"
          :hint="hint"
          :persistent-hint="persistentHint"
          :value-comparator="compareStrict"
          :items="items"
          v-model="type"
        >
          <template #item="{ item, on }">
            <v-list-item v-on="on">
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
import { ListOptions } from '../common';
import { TypeVisuals } from '../runtime/TypeVisuals';
import { TypeBuildOption, TypeBuildHandler } from '../runtime/TypeBuilder';


export default Vue.extend({
  data: () => buildTypeDialog,
  computed: {
    items(): ListOptions<TypeBuildHandler> {
      return this.input
        ? this.input.registry.getTypeBuildersFor(this.input)
        : [];
    },
    hint(): string {
      return this.type ? this.type.description || '' : '';
    },
    persistentHint(): boolean {
      return !!this.hint;
    },
  },
  methods: {
    compareStrict(a: any, b: any): boolean {
      return a === b;
    },
  },
});
</script>