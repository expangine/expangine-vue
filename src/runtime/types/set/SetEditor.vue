<template>
  <v-list class="pa-0">
    <v-list-item>
      <v-list-item-avatar class="ex-cell-top pt-1 mr-3">
        <ex-type-editor-menu
          v-bind="$props"
          :disable-sub-settings="false"
          @change="triggerChange"
        ></ex-type-editor-menu>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="primary--text">
          <strong>Set</strong>
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
    <v-list-item class="pr-0">
      <v-list-item-avatar class="ex-cell-top mr-0 pt-1">
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <ex-type-editor
          v-bind="$props"
          :type="type.options.value"
          :required-type="requiredValue"
          :required-type-options="requiredTypeOptions"
          :settings="settings.sub.value"
          :parent="type"
          :disable-sub-settings="hideSubSettings"
          @change="onChange"
        ></ex-type-editor>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Type, SetType, SetOptions, isNumber, Expression, SetOps, Exprs } from 'expangine-runtime';
import { SimpleFieldSettings } from '../../../common';
import { TypeUpdateEvent } from '../TypeVisuals';
import { SetSubs } from './SetTypes';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<SetOptions> = [];

export default TypeEditorBase<SetType, any, SetSubs>().extend({
  name: 'SetEditor',
  computed: {
    optionFields: () => fields,
    description(): string {
      return '';
    },
    requiredValue() {
      return this.requiredType && this.requiredType instanceof SetType
        ? this.requiredType.options.value
        : null;
    },
  },
  methods: {
    onChange(event: TypeUpdateEvent) {
      this.type.options.value = event.type;
      this.settings.sub.value = event.settings;

      let transform;
      if (event.transform) {
        transform = Exprs.op(SetOps.map, {
          set: Exprs.get('value'),
          transform: event.transform,
        }, {
          value: 'value',
        });
      }

      this.change({ transform });
    },
  },
});
</script>