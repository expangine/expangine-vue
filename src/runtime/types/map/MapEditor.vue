<template>
  <v-list class="pa-0">
    <v-list-item>
      <v-list-item-avatar class="ex-cell-top pt-1 mr-3">
        <ex-type-editor-menu
          v-bind="$props"
          :disable-sub-settings="false"
          @change="triggerChange"
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
      <v-list-item-avatar class="ex-cell-top large-avatar">
        <v-menu :disabled="readOnly">
          <template #activator="{ on }">
            <v-chip label link outlined v-on="on" color="accent">Key</v-chip>
          </template>
          <ex-type-hook-list
            :registry="registry"
            :parent="type"
            :parent-settings="settings"
            :type="type.options.key"
            :type-settings="settings.sub.key"
            :read-only="readOnly"
          ></ex-type-hook-list>
        </v-menu>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <ex-type-editor
          v-bind="$props"
          :type="type.options.key"
          :required-type="requiredKey"
          :required-type-options="requiredTypeOptions"
          :settings="settings.sub.key"
          :parent="type"
          :disable-sub-settings="hideSubSettings"
          @change="onChangeKey"
        ></ex-type-editor>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-avatar class="ex-cell-top large-avatar">
        <v-menu :disabled="readOnly">
          <template #activator="{ on }">
            <v-chip label link outlined v-on="on" color="accent">Value</v-chip>
          </template>
          <ex-type-hook-list
            :registry="registry"
            :parent="type"
            :parent-settings="settings"
            :type="type.options.value"
            :type-settings="settings.sub.value"
            :read-only="readOnly"
          ></ex-type-hook-list>
        </v-menu>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <ex-type-editor
          v-bind="$props"
          :type="type.options.value"
          :required-type="requiredValue"
          :required-type-options="requiredTypeOptions"
          :settings="settings.sub.value"
          :parent="type"
          :disable-sub-settings="hideSubSettings"
          @change="onChangeValue"
        ></ex-type-editor>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { MapType, MapOptions, Expression, ExpressionBuilder, MapOps } from 'expangine-runtime';
import { SimpleFieldSettings, friendlyList } from '../../../common';
import { TypeUpdateEvent } from '../TypeVisuals';
import { MapSubs } from './MapTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<MapType, any, MapSubs>().extend({
  name: 'MapEditor',
  computed: {
    requiredKey() {
      return this.requiredType && this.requiredType instanceof MapType
        ? this.requiredType.options.key
        : null;
    },
    requiredValue() {
      return this.requiredType && this.requiredType instanceof MapType
        ? this.requiredType.options.value
        : null;
    },
  },
  methods: {
    onChangeKey(event: TypeUpdateEvent) {
      this.type.options.key = event.type;
      this.$set(this.settings.sub, 'key', event.settings);

      let transform;
      if (event.transform) {
        const ex = new ExpressionBuilder();

        transform = ex.op(MapOps.map, {
          map: ex.get('value'),
          transformKey: event.transform,
        }, {
          key: 'value',
          value: 'actualValue',
        });
      }

      this.change({ transform });
    },
    onChangeValue(event: TypeUpdateEvent) {
      this.type.options.value = event.type;
      this.$set(this.settings.sub, 'value', event.settings);

      let transform;
      if (event.transform) {
        const ex = new ExpressionBuilder();

        transform = ex.op(MapOps.map, {
          map: ex.get('value'),
          transform: event.transform,
        });
      }

      this.change({ transform });
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