<template>
  <v-list>
    <v-list-item>
      <v-list-item-content>
        <ex-simple-fields
          :fields="optionFields"
          :read-only="readOnly"
          v-model="computedValue"
        ></ex-simple-fields>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-simple-table>
          <thead>
            <th>Order</th>
            <th>Property</th>
            <th>Label</th>
            <th>Align</th>
          </thead>
          <tbody>
            <template v-for="(col, index) in value.columns">
              <tr :key="col.prop">
                <td>
                  <v-btn icon block height="32" @click="move(index, -1)">
                    <v-icon>mdi-chevron-up</v-icon>
                  </v-btn>
                  <v-btn icon block height="32" @click="move(index, 1)">
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </td>
                <td>
                  {{ col.prop }}
                </td>
                <td class="pa-1">
                  <v-text-field
                    filled
                    solo
                    hide-details
                    v-model="col.label"
                    @input="input"
                  ></v-text-field>
                </td>
                <td class="pa-1">
                  <v-select
                    filled
                    solo
                    hide-details
                    clearable
                    :items="alignments"
                    v-model="col.align"
                    @input="input"
                  ></v-select>
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { ListType } from 'expangine-runtime';
import { ListObjectTableOptions } from './ListObjectTableTypes';
import { SimpleFieldSettings, ListOptions } from '../../../common';
import TypeSettingsBase from '../TypeSettingsBase';


const fields: SimpleFieldSettings<ListObjectTableOptions> = [
  { name: 'title', type: 'text', label: 'Title', defaultValue: '' },
  { name: 'height', type: 'number', label: 'Max Height' },
  { name: 'fixedHeader', type: 'boolean', label: 'Fixed Header', defaultValue: false },
  { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
  { name: 'dense', type: 'boolean', label: 'Dense', defaultValue: false },
  { name: 'paging', type: 'boolean', label: 'Pagination?', defaultValue: false },
  { name: 'pageSize', type: 'number', label: 'Page Size', required: true },
  { name: 'pagination', type: 'object', label: 'Pagination', fields: [
    { name: 'circle', type: 'boolean', label: 'Circular?' },
    { name: 'color', type: 'color', label: 'Color' },
    { name: 'totalVisible', type: 'number', label: 'Max Visible' },
    { name: 'dark', type: 'boolean', label: 'Dark', defaultValue: false },
    { name: 'nextIcon', type: 'icon', label: 'Next Icon' },
    { name: 'prevIcon', type: 'icon', label: 'Prev Icon' },
  ]},
];

const alignments: ListOptions<string | undefined> = [
  { text: 'Default', value: undefined },
  { text: 'Left', value: 'left' },
  { text: 'Right', value: 'right' },
  { text: 'Center', value: 'center' },
];

export default TypeSettingsBase<ListType, ListObjectTableOptions>().extend({
  name: 'ListObjectTableSettings',
  computed: {
    optionFields: () => fields,
    alignments: () => alignments,
  },
  methods: {
    move(index: number, dir: number) {
      const columns = this.value.columns;
      const next = index + dir;
      if (next < 0 || next >= columns.length) {
        return;
      }
      const temp = columns[index];
      this.$set(columns, index, columns[next]);
      this.$set(columns, next, temp);
      this.input();
    },
  },
});
</script>

<style lang="sass" scoped>

</style>
