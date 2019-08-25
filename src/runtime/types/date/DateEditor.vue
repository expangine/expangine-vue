<template>
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
      <v-list-item-title class="primary--text">
        <strong>Date</strong>
      </v-list-item-title>
      <v-list-item-subtitle 
        v-html="summary"
      ></v-list-item-subtitle>
      <v-list-item-subtitle 
        v-if="description"
        class="grey--text"
        v-text="description"
      ></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { DateType, DateOptions, Unit, DateFormat, currentLocale } from 'expangine-runtime';
import { ListOptions, SimpleFieldSettings, friendlyList } from '../../../common';
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
    description(): string {
      const { validateMin, validateMax, forceMin, forceMax, forceStartOf, 
        forceEndOf, parseAsUTC, withTime } = this.type.options;
      const things: string[] = [];

      const format = withTime ? 'lll' : 'll';

      if (withTime) {
        things.push('with time');
      }
      if (parseAsUTC) {
        things.push('parse as UTC');
      }
      if (validateMin) {
        things.push('must be on or after ' + DateFormat.format(format, [validateMin, currentLocale]));
      }
      if (validateMax) {
        things.push('must be before ' + DateFormat.format(format, [validateMax, currentLocale]));
      }
      if (forceMin) {
        things.push('forced to be on or after ' + DateFormat.format(format, [forceMin, currentLocale]));
      }
      if (forceMax) {
        things.push('forced to be before ' + DateFormat.format(format, [forceMax, currentLocale]));
      }
      if (forceStartOf) {
        things.push('force to start of ' + forceStartOf);
      }
      if (forceEndOf) {
        things.push('force to end of ' + forceEndOf);
      }

      return friendlyList(things);
    },
  },
});
</script>

<style lang="sass" scoped>

</style>
