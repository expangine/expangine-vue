<template>
  <v-list>
    <v-list-item>
      <v-list-item-avatar>
        <ex-type-editor-menu
          :type="type"
          :settings="settings"
          :registry="registry"
          :parent="parent"
          :read-only="readOnly"
          @input:type="updateType"
          @input:settings="updateSettings"
          @change:type="changeType"
        >
          <template #configure>
            <v-list-item>
              <v-text-field
                clearable
                filled
                type="number"
                label="Min Items"
                v-model.number="type.options.min"
                @input="updateType"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-text-field
                clearable
                filled
                hide-details
                type="number"
                label="Max Items"
                v-model.number="type.options.max"
                @input="updateType"
              ></v-text-field>
            </v-list-item>
          </template>
        </ex-type-editor-menu>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          List
        </v-list-item-title>
        <v-list-item-subtitle 
          v-html="summary"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-avatar class="cell-top mr-0 pt-1">
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <ex-type-editor
          :type="type.options.item"
          :settings="settings.sub.item"
          :registry="registry"
          :parent="type"
          :read-only="readOnly"
          @input:type="updateType"
          @input:settings="updateSettings"
          @change:type="onChangeType"
        ></ex-type-editor>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Type, ListType } from 'expangine-runtime';
import { TypeAndSettings } from '../../TypeVisuals';
import { ListListSubs } from './ListListTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<ListType, any, ListListSubs>().extend({
  name: 'ListEditor',
  methods: {
    onChangeType({ type: innerType, settings }: TypeAndSettings) {
      this.type.options.item = innerType;
      this.settings.sub.item = settings;

      this.updateTypeAndSettings();
    },
  },
});
</script>

<style scoped>
.cell-top {
  align-self: start;
}
</style>
