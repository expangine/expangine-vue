<template>
  <v-container fluid ref="parent" class="pa-0" v-resize="updateWidth">
    <v-row>
      <v-col class="pa-0">
        <v-list-item>
            <v-list-item-icon class="ex-cell-top mr-2 mt-6">
              <v-btn icon @click="addEntry">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content class="pa-0">
              {{ settings.options.title }}
            </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="(entry, entryIndex) in page">
        <v-col :key="entry.id" :cols="rowColumns" class="pa-0">
          <v-list-item :class="{ 'error white--text': entry.invalid }">
            <v-list-item-icon class="ex-cell-top mr-2 mt-6">
              <v-btn icon @click="removeEntry(entryIndex)" >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content class="pa-0">
              <v-container fluid class="pa-0">
                <v-row wrap>
                  <v-col :cols="keyColumns">
                    <ex-type-input
                      :read-only="readOnly"
                      :type="type.options.key"
                      :registry="registry"
                      :settings="settings.sub.key"
                      :value="entry.key"
                      @input="setKey(entryIndex, $event)"
                    ></ex-type-input>
                  </v-col>
                  <v-col :cols="valueColumns">
                    <ex-type-input
                      :read-only="readOnly"
                      :type="type.options.value"
                      :registry="registry"
                      :settings="settings.sub.value"
                      :value="entry.value"
                      :path="valuePath(entry.key)"
                      :data="data"
                      @input="setValue(entryIndex, $event)"
                    ></ex-type-input>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </template>
    </v-row>
    <v-row if="hasPaging">
      <v-col>
        <v-pagination
          v-bind="pagination"
          v-model="pageIndex"
          :length="pageCount"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { MapType, isFunction } from 'expangine-runtime';
import { getConfirmation } from '../../../app/Confirm';
import { MapGridOptions } from './MapGridTypes';
import { MapSubs } from './MapTypes';
import { TypeSettings } from '../TypeVisuals';
import TypeInputBase from '../TypeInputBase';


const MIN_INPUT_WIDTH = 300;
const GRID_COLUMNS = 12;
const MIN_COLUMN_TO_COLUMNS = [
  1,  // 0
  1,  // 1
  2,  // 2
  3,  // 3
  4,  // 4
  6,  // 5
  6,  // 6
  12, // 7
  12, // 8
  12, // 9
  12, // 10
  12, // 11
  12, // 12
];

interface MapEntry {
  id: number;
  key: any;
  value: any;
  invalid: boolean;
}

export default TypeInputBase<MapType, MapGridOptions, Map<any, any>, MapSubs>(Map).extend({
  name: 'MapGrid',
  data: () => ({
    entries: [] as MapEntry[],
    pageIndex: 1,
    width: 1,
    id: 0,
    changes: 1,
  }),
  computed: {
    minKeyWidth(): number {
      return this.settings.options.minKeyWidth || MIN_INPUT_WIDTH;
    },
    minValueWidth(): number {
      return this.settings.options.minValueWidth || MIN_INPUT_WIDTH;
    },
    minRowWidth(): number {
      return this.minKeyWidth + this.minValueWidth;
    },
    twoLines(): boolean {
      return this.width < this.minKeyWidth || this.width < this.minValueWidth;
    },
    keyColumns(): number {
      return this.twoLines
        ? GRID_COLUMNS
        : Math.ceil(this.minKeyWidth / (this.minKeyWidth + this.minValueWidth) * GRID_COLUMNS);
    },
    valueColumns(): number {
      return this.twoLines
        ? GRID_COLUMNS
        : GRID_COLUMNS - this.keyColumns;
    },
    rowColumns(): number {
      if (this.twoLines) {
        return GRID_COLUMNS;
      }
      const minColumns = Math.ceil(this.minRowWidth / this.width * GRID_COLUMNS);
      const clamped = Math.max(0, Math.min(minColumns, GRID_COLUMNS));
      return MIN_COLUMN_TO_COLUMNS[clamped];
    },
    rowCount(): number {
      return this.changes ? this.entries.length : 0;
    },
    pagination(): any {
      return this.settings.options.pagination;
    },
    hasPaging(): boolean {
      return !!this.settings.options.paging && !!this.pagination;
    },
    pageSize(): number {
      return this.settings.options.pageSize || 10;
    },
    pageCount(): number {
      return Math.ceil(this.rowCount / this.pageSize);
    },
    pageStart(): number {
      return this.hasPaging
        ? Math.min(Math.min(this.pageIndex - 1, this.pageCount - 1) * this.pageSize, this.rowCount)
        : 0;
    },
    pageEnd(): number {
      return this.hasPaging
        ? Math.min(this.pageStart + this.pageSize, this.rowCount)
        : this.rowCount;
    },
    page(): any[] {
      return this.entries.slice(this.pageStart, this.pageEnd);
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(map) {
        this.entries = map instanceof Map
          ? Array.from(map.entries()).map(([key, value]) => ({ key, value, invalid: false, id: ++this.id }))
          : [];
      },
    },
  },
  methods: {
    valuePath(key: string): Array<string | number> {
      return this.path.concat([key]);
    },
    updateWidth() {
      const el = this.$refs.parent as HTMLElement;
      this.width = Math.max(1, el.offsetWidth);
    },
    setValue(pageIndex: number, newValue: any) {
      const index = pageIndex + this.pageStart;
      const entry = this.entries[index];
      this.computedValue.set(entry.key, newValue);
      entry.value = newValue;
      this.update();
    },
    setKey(pageIndex: number, newKey: any) {
      const index = pageIndex + this.pageStart;
      const entry = this.entries[index];

      this.computedValue.delete(entry.key);

      if (this.computedValue.has(newKey)) {
        entry.invalid = true;
      } else {
        entry.invalid = false;
        entry.key = newKey;
        this.computedValue.set(newKey, entry.value);
      }

      this.update();
    },
    async removeEntry(pageIndex: number) {
      const index = pageIndex + this.pageStart;
      if (!await getConfirmation()) {
        return;
      }

      const entry = this.entries[index];
      this.computedValue.delete(entry.key);
      this.entries.splice(index, 1);
      this.update();
      this.changes++;
    },
    addEntry() {
      const { key, value } = this.type.options;
      const { key: keySettings, value: valueSettings } = this.settings.sub as Record<MapSubs, TypeSettings<any, any>>;
      const newKey = key.fromJson(keySettings.defaultValue);
      const newValue = value.fromJson(valueSettings.defaultValue);
      
      const entry: MapEntry = {
        id: ++this.id,
        key: newKey,
        value: newValue,
        invalid: this.computedValue.has(newKey),
      };

      this.entries.push(entry);

      if (!entry.invalid) {
        this.computedValue.set(entry.key, entry.value);
        this.update();
      }
      
      this.changes++;
    },
  },
});
</script>