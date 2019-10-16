<template>
  <v-list class="pa-0">
    <v-list-item>
      <v-list-item-avatar class="cell-top pt-1 mr-3">
        <ex-type-editor-menu
          :type="type"
          :settings="settings"
          :registry="registry"
          :parent="parent"
          :read-only="readOnly"
          @change="triggerChange"
        ></ex-type-editor-menu>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="primary--text">
          <strong>List</strong>
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
    <v-list-item>
      <v-list-item-avatar class="cell-top mr-0 pt-1">
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="pa-0">
        <ex-type-editor
          :type="type.options.item"
          :settings="settings.sub.item"
          :registry="registry"
          :parent="type"
          :read-only="readOnly"
          :disable-sub-settings="hideSubSettings"
          @change="onChange"
        ></ex-type-editor>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Type, ListType, ListOptions, isNumber, Expression, ListOps, ExpressionBuilder } from 'expangine-runtime';
import { SimpleFieldSettings, friendlyList } from '../../../common';
import { TypeUpdateEvent } from '../TypeVisuals';
import { ListSubs } from './ListTypes';
import TypeEditorBase from '../TypeEditorBase';


const fields: SimpleFieldSettings<ListOptions> = [
  { name: 'min', type: 'number', label: 'Min' },
  { name: 'max', type: 'number', label: 'Max' },
];

export default TypeEditorBase<ListType, any, ListSubs>().extend({
  name: 'ListEditor',
  computed: {
    optionFields: () => fields,
    description(): string {
      const { min, max } = this.type.options;
      const things: string[] = [];

      if (isNumber(min) && isNumber(max)) {
        things.push('between ' + min + ' and ' + max + ' items');
      } else if (isNumber(min)) {
        things.push('at least ' + min + ' items');
      } else if (isNumber(max)) {
        things.push('no more than ' + max + ' items');
      }

      return friendlyList(things);
    },
  },
  methods: {
    onChange(event: TypeUpdateEvent) {
      this.type.options.item = event.type;
      this.settings.sub.item = event.settings;

      let transform;
      if (event.transform) {
        const ex = new ExpressionBuilder();

        transform = ex.op(ListOps.map, {
          list: ex.get('value'),
          transform: event.transform,
        }, {
          item: 'value',
        });
      }

      this.update({ transform });
    },
  },
});
</script>