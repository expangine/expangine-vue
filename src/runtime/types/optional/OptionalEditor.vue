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
        @change="triggerChange"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content class="pa-0">
      <ex-type-editor
        :type="type.options"
        :parent="type"
        :settings="settings.sub.innerType"
        :registry="registry"
        :read-only="readOnly"
        @change="onChange"
      ></ex-type-editor>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { OptionalType } from 'expangine-runtime';
import { TypeUpdateEvent } from '../TypeVisuals';
import { OptionalSubs, OptionalOptions } from './OptionalTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<OptionalType, OptionalOptions, OptionalSubs>().extend({
  name: 'OptionalEditor',
  methods: {
    onChange(event: TypeUpdateEvent) {
      this.type.options = event.type;
      this.settings.sub.innerType = event.settings;
      
      // TODO transform

      this.update();
    },
  },
});
</script>
