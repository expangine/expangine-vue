<template>
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
              label="Min Length"
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
              label="Max Length"
              v-model.number="type.options.max"
              @input="updateType"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              hide-details
              label="Require Uppercase"
              v-model="type.options.requireUpper"
              @input="updateType"
            ></v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              hide-details
              label="Require Lowercase"
              v-model="type.options.requireLower"
              @input="updateType"
            ></v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              hide-details
              label="Force Uppercase"
              v-model="type.options.forceUpper"
              @input="updateType"
            ></v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              hide-details
              label="Force Lowercase"
              v-model="type.options.forceLower"
              @input="updateType"
            ></v-checkbox>
          </v-list-item>
        </template>
      </ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        Text 
      </v-list-item-title>
      <v-list-item-subtitle 
        v-html="summary"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { TextType } from 'expangine-runtime';
import TypeEditorBase from '../TypeEditorBase';

export default TypeEditorBase<TextType, any>().extend({
  name: 'TextEditor',
});
</script>

<style lang="sass" scoped>

</style>
