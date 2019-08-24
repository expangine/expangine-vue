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
        Text 
      </v-list-item-title>
      <v-list-item-subtitle 
        v-html="summary"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { TextType, TextOptions } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<TextOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'requireUpper', type: 'boolean', label: 'Require Upper'},
  { name: 'requireLower', type: 'boolean', label: 'Require Lower'},
  { name: 'forceUpper', type: 'boolean', label: 'Force Upper'},
  { name: 'forceLower', type: 'boolean', label: 'Force Lower'},
];

export default TypeEditorBase<TextType, any>().extend({
  name: 'TextEditor',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
