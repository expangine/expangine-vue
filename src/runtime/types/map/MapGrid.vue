<template>
  <v-container fluid ref="parent" class="pa-0" v-resize="updateWidth">
    <v-row>
      <v-col class="pa-0">
        <v-list-item>
            <v-list-item-icon class="cell-top mr-2 mt-6">
              <v-btn icon @click="addEntry">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content class="pa-0">
              {{ settings.options.title }}
            </v-list-item-content>
        </v-list-item>
      </v-col>
      <template v-for="(entry, entryIndex) in entries">
        <v-col :key="entry.id" :cols="rowColumns" class="pa-0">
          <v-list-item :class="{ 'error white--text': entry.invalid }">
            <v-list-item-icon class="cell-top mr-2 mt-6">
              <v-btn icon @click="removeEntry(entryIndex)" >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-content class="pa-0">
              <v-container class="pa-0">
                <v-row>
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
  </v-container>
</template>

<script lang="ts">
import { MapType, toArray } from 'expangine-runtime';
import { confirm } from '../../../app/Confirm';
import { MapGridOptions } from './MapGridTypes';
import { MapSubs } from './MapTypes';
import { TypeSettings } from '../../TypeVisuals';
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
    width: 1,
    id: 0,
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
    keyColumns(): number {
      return Math.ceil(this.minKeyWidth / (this.minKeyWidth + this.minValueWidth) * GRID_COLUMNS);
    },
    valueColumns(): number {
      return GRID_COLUMNS - this.keyColumns;
    },
    rowColumns(): number {
      const minColumns = Math.ceil(this.minRowWidth / this.width * GRID_COLUMNS);
      const clamped = Math.max(0, Math.min(minColumns, GRID_COLUMNS));
      return MIN_COLUMN_TO_COLUMNS[clamped];
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(map) {
        this.entries = map instanceof Map
          ? toArray(map.entries()).map(([key, value]) => ({ key, value, invalid: false, id: ++this.id }))
          : [];
      },
    },
  },
  methods: {
    updateWidth() {
      const el = this.$refs.parent as HTMLElement;
      this.width = Math.max(1, el.offsetWidth);
    },
    setValue(index: number, newValue: any) {
      const entry = this.entries[index];
      this.value.set(entry.key, newValue);
      entry.value = newValue;
      this.update();
    },
    setKey(index: number, newKey: any) {
      const entry = this.entries[index];

      this.value.delete(entry.key);

      if (this.value.has(newKey)) {
        entry.invalid = true;
      } else {
        entry.invalid = false;
        entry.key = newKey;
        this.value.set(newKey, entry.value);
      }

      this.update();
    },
    async removeEntry(index: number) {
      if (!await confirm()) {
        return;
      }

      const entry = this.entries[index];
      this.value.delete(entry.key);
      this.entries.splice(index, 1);
      this.update();
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
        invalid: this.value.has(newKey),
      };

      this.entries.push(entry);

      if (!entry.invalid) {
        this.value.set(entry.key, entry.value);
        this.update();
      }
    },
  },
});
</script>