<template>
  <v-list>
    <v-list-item>
      <v-text-field
        filled
        label="Title"
        v-model="value.title"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-select
        filled
        label="Sizes"
        hint="Columns and offsets work in a 12 column grid. A column/offset for one size is applied to all smaller sizes without a setting."
        persistent-hint
        :items="sizeOptions"
        v-model="size"
      ></v-select>
    </v-list-item>
    <v-list-item>
      <v-simple-table>
        <thead>
          <th>Index</th>
          <th>Columns</th>
          <th>Offsets</th>
        </thead>
        <tbody>
          <template v-for="(col, index) in value.columns">
            <tr :key="index">
              <td>
                {{ index }}
              </td>
              <td class="pa-1">
                <v-select
                  filled
                  solo
                  hide-details
                  :items="columnOptions"
                  v-model="col[size.columns]"
                  @input="input"
                ></v-select>
              </td>
              <td class="pa-1">
                <v-select
                  filled
                  solo
                  hide-details
                  :items="offsetOptions"
                  v-model="col[size.offset]"
                  @input="input"
                ></v-select>
              </td>
            </tr>
          </template>
        </tbody>
      </v-simple-table>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { TupleType } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { TupleGridOptions } from './TupleGridTypes';
import TypeSettingsBase from '../TypeSettingsBase';


interface SizeOption { columns: string; offset: string; }

const sizeOptions: ListOptions<SizeOption> = [
  { text: 'Small to large handset (<600px)', value: { columns: 'cols', offset: 'offset' } },
  { text: 'Small to medium tablet (<960px)', value: { columns: 'sm', offset: 'offsetSm' } },
  { text: 'Large tablet to laptop (<1264px)', value: { columns: 'md', offset: 'offsetMd' } },
  { text: 'Desktop (<1904px)', value: { columns: 'lg', offset: 'offsetLg' } },
  { text: '4k and ultra-wides (>1904px)', value: { columns: 'xl', offset: 'offsetXl' } },
];

const columnOptions: ListOptions<number | undefined> = [
  { text: 'auto', value: undefined },
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
  { text: '4', value: 4 },
  { text: '5', value: 5 },
  { text: '6', value: 6 },
  { text: '7', value: 7 },
  { text: '8', value: 8 },
  { text: '9', value: 9},
  { text: '10', value: 10 },
  { text: '11', value: 11 },
  { text: '12', value: 12 },
];

const offsetOptions: ListOptions<number | undefined> = [
  { text: '0', value: undefined },
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
  { text: '4', value: 4 },
  { text: '5', value: 5 },
  { text: '6', value: 6 },
  { text: '7', value: 7 },
  { text: '8', value: 8 },
  { text: '9', value: 9},
  { text: '10', value: 10 },
  { text: '11', value: 11 },
];

export default TypeSettingsBase<TupleType, TupleGridOptions>().extend({
  name: 'TupleGridSettings',
  data: () => ({
    size: sizeOptions[0].value,
  }),
  computed: {
    sizeOptions: () => sizeOptions,
    columnOptions: () => columnOptions,
    offsetOptions: () => offsetOptions,
  },
});
</script>

<style scoped>
.v-data-table {
  width: 100%;
}
</style>
