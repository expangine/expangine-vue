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
            <ex-simple-fields
              remove-empty
              :value="type.options"
              :fields="optionFields"
              :read-only="readOnly"
              @input="updateType"
            ></ex-simple-fields>
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
import { Type, ListType, ListOptions } from 'expangine-runtime';
import { TypeAndSettings } from '../../TypeVisuals';
import { ListListSubs } from './ListListTypes';
import { SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<ListOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
];


export default TypeEditorBase<ListType, any, ListListSubs>().extend({
  name: 'ListEditor',
  computed: {
    optionFields: () => fields,
  },
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
