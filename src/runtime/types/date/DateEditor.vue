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
        Date 
      </v-list-item-title>
      <v-list-item-subtitle 
        v-html="summary"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { DateType, DateOptions, Unit } from 'expangine-runtime';
import { ListOptions, SimpleFieldSettings } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


const unitOptions: ListOptions<Unit> = [
  { text: 'Millisecond', value: 'millis' },
  { text: 'Second', value: 'second' },
  { text: 'Minute', value: 'minute' },
  { text: 'Hour', value: 'hour' },
  { text: 'Day', value: 'day' },
  { text: 'Week', value: 'week' },
  { text: 'Month', value: 'month' },
  { text: 'Quarter', value: 'quarter' },
  { text: 'Year', value: 'year' },
];

const fields: SimpleFieldSettings<DateOptions> = [
  { name: 'validateMin', type: 'date', label: 'Validate Min' },
  { name: 'validateMax', type: 'date', label: 'Validate Max' },
  { name: 'forceMin', type: 'date', label: 'Force Min' },
  { name: 'forceMax', type: 'date', label: 'Force Max' },
  { name: 'forceStartOf', type: 'select', label: 'Force Start Of', items: unitOptions },
  { name: 'forceEndOf', type: 'select', label: 'Force End Of', items: unitOptions },
  { name: 'withTime', type: 'boolean', label: 'With Time' },
  { name: 'parseAsUTC', type: 'boolean', label: 'Parse as UTC' },
];

export default TypeEditorBase<DateType, any>().extend({
  name: 'DateEditor',
  computed: {
    optionFields: () => fields,
  },
});
</script>

<style lang="sass" scoped>

</style>
