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
            <ex-date-picker
              v-model="type.options.validateMin"
              :text-props="{ filled: true, clearable: true, label: 'Validate Min', prependInnerIcon: 'mdi-calendar' }"
              @input="updateType"
            ></ex-date-picker>
          </v-list-item>
          <v-list-item>
            <ex-date-picker
              v-model="type.options.validateMax"
              :text-props="{ filled: true, clearable: true, label: 'Validate Max', prependInnerIcon: 'mdi-calendar' }"
              @input="updateType"
            ></ex-date-picker>
          </v-list-item>
          <v-list-item>
            <ex-date-picker
              v-model="type.options.forceMin"
              :text-props="{ filled: true, clearable: true, label: 'Force Min', prependInnerIcon: 'mdi-calendar' }"
              @input="updateType"
            ></ex-date-picker>
          </v-list-item>
          <v-list-item>
            <ex-date-picker
              v-model="type.options.forceMax"
              :text-props="{ filled: true, clearable: true, label: 'Force Max', prependInnerIcon: 'mdi-calendar' }"
              @input="updateType"
            ></ex-date-picker>
          </v-list-item>
          <v-list-item>
            <v-select
              filled
              label="Force Start Of"
              :items="unitOptions"
              v-model="type.options.forceStartOf"
              @input="updateType"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-select
              filled
              hide-details
              label="Force End Of"
              :items="unitOptions"
              v-model="type.options.forceEndOf"
              @input="updateType"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              hide-details
              label="With Time"
              v-model="type.options.withTime"
              @input="updateType"
            ></v-checkbox>
          </v-list-item>
          <v-list-item>
            <v-checkbox
              hide-details
              label="Parse as UTC"
              v-model="type.options.parseAsUTC"
              @input="updateType"
            ></v-checkbox>
          </v-list-item>
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
import { DateType } from 'expangine-runtime';
import TypeEditorBase from '../TypeEditorBase';
import { ListOptions } from '../../../common';


const unitOptions: ListOptions = [
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

export default TypeEditorBase<DateType, any>().extend({
  name: 'DateEditor',
  computed: {
    unitOptions: () => unitOptions,
  },
});
</script>

<style lang="sass" scoped>

</style>
