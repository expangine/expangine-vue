<template>
  <v-list>
    <v-list-item v-if="hasHeader">
      <v-list-item-avatar class="mr-0">
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn icon v-if="canAdd" v-on="on" @click="addItem">
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
        <v-list-item-avatar class="cell-top pt-1 mr-0">
          <v-menu>
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
              <v-list-item v-if="canInsert" @click="insertAt(itemIndex)">
                <v-list-item-content>
                  Insert {{ itemName }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="canAdd" @click="addItem">
                <v-list-item-content>
                  Add {{ itemName }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="canMove(itemIndex, -1)" @click="moveTo(itemIndex, 0)">
                <v-list-item-content>
                  Move to Top
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="canMove(itemIndex, -1)" @click="move(itemIndex, -1)">
                <v-list-item-content>
                  Move Up
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="canMove(itemIndex, 1)" @click="move(itemIndex, 1)">
                <v-list-item-content>
                  Move Down
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="canMove(itemIndex, 1)" @click="moveTo(itemIndex, rowCount - 1)">
                <v-list-item-content>
                  Move to Bottom
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-avatar>
        <v-list-item-content class="list-item">
          <ex-type-input
            :value="item"
            :type="itemType"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings.sub.item"
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
import { Type, ListType, isNumber } from 'expangine-runtime';
import { TypeSettings } from '../TypeVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { ListSubs } from './ListTypes';
import { ListListOptions } from './ListListTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListListOptions, any[], ListSubs>(Array).extend({
  name: 'ListList',
  data: () => ({
    pageIndex: 1,
  }),
  computed: {
    hasHeader(): boolean {
      return !!(this.settings.options.title || this.canAdd);
    },
    itemType(): Type {
      return this.type.options.item;
    },
    itemSettings(): TypeSettings<any, any> {
      return this.settings.sub.item;
    },
    itemName(): string {
      return this.settings.options.itemName || 'Item';
    },
    canRemove(): boolean {
      if (this.settings.options.hideRemove) {
        return false;
      }
      if (isNumber(this.type.options.min)) {
        return this.rowCount > this.type.options.min;
      }
      return true;
    },
    canInsert(): boolean {
      if (this.settings.options.hideInsert) {
        return false;
      }
      return this.canAdd;
    },
    canAdd(): boolean {
      if (isNumber(this.type.options.max)) {
        return this.rowCount < this.type.options.max;
      }
      return true;
    },
    rowCount(): number {
      return this.value.length;
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
      return this.value.slice(this.pageStart, this.pageEnd);
    },
  },
  watch: {
    value: {
      deep: true,
      handler: () => { /* nothing */ },
    },
  },
  methods: {
    async removeAt(pageIndex: number) {
      const index = pageIndex + this.pageStart;
      if (!await getConfirmation()) {
        return;
      }

      this.value.splice(index, 1);
      this.update();
      this.$forceUpdate();
    },
    canMove(pageIndex: number, dir: number) {
      const index = pageIndex + this.pageStart;
      const next = index + dir;

      return next >= 0 && next < this.rowCount && !this.settings.options.hideSort;
    },
    moveTo(pageIndex: number, to: number) {
      const from = pageIndex + this.pageStart;
      const moving = this.value[from];
      this.value.splice(from, 1);
      this.value.splice(to, 0, moving);
      this.update();
    },
    move(pageIndex: number, dir: number) {
      this.moveTo(pageIndex, pageIndex + dir + this.pageStart);
    },
    insertAt(pageIndex: number) {
      const index = pageIndex + this.pageStart;
      this.value.splice(index, 0, this.itemType.fromJson(this.itemSettings.defaultValue));
      this.update();
      this.$forceUpdate();
    },
    setItem(pageIndex: number, item: any) {
      const index = pageIndex + this.pageStart;
      this.$set(this.value, index, item);
      this.update();
    },
    addItem() {
      this.value.push(this.itemType.fromJson(this.itemSettings.defaultValue));
      this.pageIndex = this.pageCount;
      this.update();
      this.$forceUpdate();
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
