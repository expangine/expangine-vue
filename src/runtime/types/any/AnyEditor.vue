<template>
  <v-list-item>
    <v-list-item-avatar class="cell-top pt-1 mr-3">
      <ex-type-editor-menu
        :type="type"
        :settings="settings"
        :registry="registry"
        :parent="parent"
        :read-only="readOnly"
        :disable-sub-settings="disableSubSettings"
        @change="triggerChange"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="primary--text">
        <strong>Any</strong>
      </v-list-item-title>
      <v-list-item-subtitle 
        v-if="!disableSubSettings"
        v-html="summary"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { AnyType } from 'expangine-runtime';
import { AnyOptions } from './AnyTypes';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<AnyType, AnyOptions>().extend({
  name: 'AnyEditor',
});
</script>
