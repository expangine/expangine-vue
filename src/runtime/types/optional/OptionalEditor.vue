<template>
  <v-list-item>
    <v-list-item-avatar class="cell-top mr-0 pt-1">
      <ex-type-editor-menu
        icon="mdi-help-circle-outline"
        :type="type"
        :settings="settings"
        :registry="registry"
        :parent="parent"
        :read-only="readOnly"
        :disable-sub-settings="disableSubSettings"
        @input:type="updateType"
        @input:settings="updateSettings"
        @change:type="changeType"
        @transform="transform"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content class="pa-0">
      <ex-type-editor
        :type="type.options"
        :parent="type"
        :settings="settings.sub.innerType"
        :registry="registry"
        :read-only="readOnly"
        @input:type="updateType"
        @input:settings="updateSettings"
        @change:type="onChangeType"
      ></ex-type-editor>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { OptionalType } from 'expangine-runtime';
import { TypeAndSettings } from '../../TypeVisuals';
import { OptionalSubs, OptionalOptions } from './OptionalTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<OptionalType, OptionalOptions, OptionalSubs>().extend({
  name: 'OptionalEditor',
  methods: {
    onChangeType({ type: innerType, settings }: TypeAndSettings) {
      this.type.options = innerType;
      this.settings.sub.innerType = settings;

      this.updateTypeAndSettings();
    },
  },
});
</script>
