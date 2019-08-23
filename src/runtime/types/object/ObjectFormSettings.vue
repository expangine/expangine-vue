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
          <th>Order</th>
          <th>Property</th>
          <th>Columns</th>
          <th>Offsets</th>
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
        <tfoot v-if="hasOutside">
          <td>
            <v-btn icon @click="add">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </td>
          <td colspan="3" class="pa-1">
            <v-select
              filled
              solo
              hide-details
              label="Property"
              :items="outsideOptions"
              v-model="outside"
            ></v-select>
          </td>
        </tfoot>
      </v-simple-table>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { ObjectType } from 'expangine-runtime';
import { ListOptions } from '../../../common';
import { ObjectFormOptions } from './ObjectFormTypes';
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

export default TypeSettingsBase<ObjectType, ObjectFormOptions>().extend({
  data: () => ({
    outside: null as null | string,
    size: sizeOptions[0].value,
  }),
  computed: {
    sizeOptions: () => sizeOptions,
    columnOptions: () => columnOptions,
    offsetOptions: () => offsetOptions,
    hasOutside(): boolean {
      return this.outsideOptions.length > 0;
    },
    outsideOptions(): ListOptions<string> {
      const columns = this.value.columns;
      const props = Object.assign({}, this.type.options.props);
      
      for (const col of columns) {
        delete props[col.prop];
      }

      const outside = Object.keys(props);

      return outside.map((prop) => ({
        text: prop,
        value: prop,
      }));
    },
  },
  methods: {
    add() {
      const prop = this.outside || this.outsideOptions[0].value;

      this.value.columns.push({ prop, cols: 12 });
      this.input();
    },
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

<style scoped>
.v-data-table {
  width: 100%;
}
</style>
