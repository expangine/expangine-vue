<template>
  <v-list class="pa-0">
    <v-list-item>
      <v-list-item-avatar class="cell-top pt-1 mr-3">
        <ex-type-editor-menu
          :type="type"
          :settings="settings"
          :registry="registry"
          :parent="parent"
          :read-only="readOnly"
          @input:type="updateType"
          @input:settings="updateSettings"
          @change:type="changeType"
        ></ex-type-editor-menu>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="primary--text">
          <strong>Map</strong>
        </v-list-item-title>
        <v-list-item-subtitle 
          v-if="!disableSubSettings"
          v-html="summary"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-avatar class="cell-top large-avatar">
        <v-chip label link outlined color="accent">Key</v-chip>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <ex-type-editor
          :type="type.options.key"
          :settings="settings.sub.key"
          :registry="registry"
          :parent="type"
          :read-only="readOnly"
          :disable-sub-settings="hideSubSettings"
          @input:type="updateType"
          @input:settings="updateSettings"
          @change:type="onChangeKey"
        ></ex-type-editor>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-avatar class="cell-top large-avatar">
        <v-chip label link outlined color="accent">Value</v-chip>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <ex-type-editor
          :type="type.options.value"
          :settings="settings.sub.value"
          :registry="registry"
          :parent="type"
          :read-only="readOnly"
          :disable-sub-settings="hideSubSettings"
          @input:type="updateType"
          @input:settings="updateSettings"
          @change:type="onChangeValue"
        ></ex-type-editor>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { MapType, MapOptions } from 'expangine-runtime';
import { SimpleFieldSettings, friendlyList } from '../../../common';
import { TypeAndSettings } from '../../TypeVisuals';
import { MapSubs } from './MapTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<MapType, any, MapSubs>().extend({
  name: 'MapEditor',
  methods: {
    onChangeKey({ type: keyType, settings: keySettings }: TypeAndSettings) {
      this.type.options.key = keyType;
      this.$set(this.settings.sub, 'key', keySettings);

      this.updateTypeAndSettings();
    },
    onChangeValue({ type: valueType, settings: valueSettings }: TypeAndSettings) {
      this.type.options.value = valueType;
      this.$set(this.settings.sub, 'value', valueSettings);

      this.updateTypeAndSettings();
    },
  },
});
</script>

<style lang="less" scoped>
.large-avatar {
  min-width: 64px !important;
  width: 64px !important;
  text-align: right;
  margin-right: 0px !important;
  justify-content: flex-end !important;
}
</style>