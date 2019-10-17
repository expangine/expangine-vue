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
        :hide-settings="hideSettings"
        @change="triggerChange"
      ></ex-type-editor-menu>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="primary--text">
        <strong>Date</strong>
      </v-list-item-title>
      <v-list-item-subtitle 
        v-if="!disableSubSettings"
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
import { DateType, DateFormat, currentLocale } from 'expangine-runtime';
import { friendlyList } from '../../../common';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<DateType, any>().extend({
  name: 'DateEditor',
  computed: {
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