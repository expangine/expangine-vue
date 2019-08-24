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
        Number 
      </v-list-item-title>
      <v-list-item-subtitle 
        v-html="summary"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { NumberType, NumberOptions } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<NumberOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
  { name: 'whole', type: 'boolean', label: 'Whole' },
];

export default TypeEditorBase<NumberType, any>().extend({
  name: 'NumberEditor',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
