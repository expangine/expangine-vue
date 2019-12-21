<template>
  <v-list>
    <v-list-item v-if="hasHeader">
      <v-list-item-avatar class="mr-0">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn icon :disabled="!canAdd" v-on="on" @click="addItem">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Add {{ itemName }}</span>
        </v-tooltip>
      </v-list-item-avatar>
      <v-list-item-content v-if="settings.options.title">
        {{ settings.options.title }}
      </v-list-item-content>
    </v-list-item>
    <template v-for="(item, itemIndex) in page">
      <v-list-item :key="itemIndex">
        <v-list-item-avatar class="ex-cell-top pt-1 mr-0">
          <v-menu :disabled="readOnly">
            <template #activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-if="canRemove" @click="removeAt(itemIndex)">
                <v-list-item-content>
                  Remove {{ itemName }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="canAdd" @click="addItem">
                <v-list-item-content>
                  Add {{ itemName }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-avatar>
        <v-list-item-content class="list-item">
          <ex-type-input
            :value="item.data"
            :type="itemType"
            :path="item.path"
            :data="data"
            :read-only="readOnly"
            :registry="registry"
            :settings="itemSettings"
            @input="setItem(itemIndex, $event)"
          ></ex-type-input>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list-item v-if="hasPaging">
      <v-list-item-content>
        <v-pagination
          v-bind="pagination"
          v-model="pageIndex"
          :length="pageCount"
        ></v-pagination>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Type, SetType, isNumber, isFunction } from 'expangine-runtime';
import { TypeSettings } from '../TypeVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { SetSubs } from './SetTypes';
import { SetListOptions } from './SetListTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<SetType, SetListOptions, Set<any>, SetSubs>(Set).extend({
  name: 'SetList',
  data: () => ({
    pageIndex: 1,
    changes: 1,
    syncTimeout: -1,
    syncDelay: 1000,
    list: [] as any[],
  }),
  computed: {
    hasHeader(): boolean {
      return !!(this.settings.options.title || this.canAdd);
    },
    itemType(): Type {
      return this.type.options.value;
    },
    itemSettings(): TypeSettings<any, any> {
      return this.settings.sub.value;
    },
    itemName(): string {
      return this.settings.options.itemName || 'Value';
    },
    canRemove(): boolean {
      if (this.settings.options.hideRemove) {
        return false;
      }
      return true;
    },
    canInsert(): boolean {
      if (this.settings.options.hideInsert) {
        return false;
      }
      if (this.data) {
        return false;
      }
      return this.canAdd;
    },
    canAdd(): boolean {
      if (this.readOnly) {
        return false;
      }
      return true;
    },
    rowCount(): number {
      return this.changes ? this.list.length : 0;
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
      const { list, pageStart, pageEnd, path, changes } = this;

      return list.slice(pageStart, pageEnd)
        .map((data, index) => ({ data, path: path.concat([index + pageStart]) }))
      ;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.updateList();
      },
    },
  },
  methods: {
    updateList() {
      this.list = Array.from(this.computedValue);
    },
    sync() {
      this.computedValue = new Set(this.list);
      if (this.computedValue.size !== this.list.length) {
        this.updateList();
      }
    },
    syncQueue() {
      window.clearTimeout(this.syncTimeout);
      this.syncTimeout = window.setTimeout(this.sync, this.syncDelay);
    },
    async removeAt(pageIndex: number) {
      const index = pageIndex + this.pageStart;
      if (!await getConfirmation()) {
        return;
      }

      if (this.data) {
        await this.data.remove(this.path.concat([index]));
        // TODO fix & query
      } else {
        this.list.splice(index, 1);
        this.syncQueue();
      }
      this.changes++;
    },
    async setItem(pageIndex: number, item: any) {
      const index = pageIndex + this.pageStart;
      if (this.data) {
        await this.data.set(this.path.concat([index]), item);
        // TODO fix & query
      } else {
        this.$set(this.list, index, item);
        this.syncQueue();
      }
    },
    async addItem() {
      const item = this.itemType.fromJson(this.itemSettings.defaultValue);
      if (this.data) {
        await this.data.add(this.path, item);
        // TODO fix & query
      } else {
        this.list.push(item);
        this.pageIndex = this.pageCount;
        this.syncQueue();
      }
      this.changes++;
    },
  },
});
</script>

<style scoped>
.list-item {
  padding: 0;
}
.list-item >>> .container.object-form {
  padding: 0px 4px;
}
</style>
