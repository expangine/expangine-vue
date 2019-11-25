<template>
  <v-simple-table v-bind="settings.options">
    <template #default>
      <colgroup>
        <col style="width: 70px">
      </colgroup>
      <thead>
        <tr v-if="settings.options.title">
          <td colspan="100%">
            <strong v-html="settings.options.title"></strong>
          </td>
        </tr>
        <tr>
          <th>
            <v-menu v-if="hasMenu">
              <template #activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-settings</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-if="canAdd" @click="addItem">
                  <v-list-item-content>
                    Add {{ itemName }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="canCancelSort" @click="sortCancel">
                  <v-list-item-content>
                    Cancel Sort
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="canSaveSort" @click="sortSave">
                  <v-list-item-content>
                    Save Sort
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="canExport" @click="exportCsv">
                  <v-list-item-content>
                    Export CSV
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="canImport" @click="importCsv">
                  <v-list-item-content>
                    Import CSV
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </th>
          <template v-for="col in columns">
            <th :class="'text-' + col.align" :key="col.prop" @click="sortToggle(col.prop)">
              {{ col.label }}
              <v-icon>{{ getSortingIcon(col.prop) }}</v-icon>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, rowIndex) in page">
          <tr :key="rowIndex">
            <td>
              <v-menu>
                <template #activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-if="canRemove" @click="removeAt(rowIndex)">
                    <v-list-item-content>
                      Remove {{ itemName }}
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="canInsert" @click="insertAt(rowIndex)">
                    <v-list-item-content>
                      Insert {{ itemName }}
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="canAdd" @click="addItem">
                    <v-list-item-content>
                      Add {{ itemName }}
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="canMove(rowIndex, -1)" @click="moveTo(rowIndex, 0)">
                    <v-list-item-content>
                      Move to Top
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="canMove(rowIndex, -1)" @click="move(rowIndex, -1)">
                    <v-list-item-content>
                      Move Up
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="canMove(rowIndex, 1)" @click="move(rowIndex, 1)">
                    <v-list-item-content>
                      Move Down
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="canMove(rowIndex, 1)" @click="moveTo(rowIndex, rowCount - 1)">
                    <v-list-item-content>
                      Move to Bottom
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
            <template v-for="col in columns">
              <td :key="col.prop" class="pl-1 pr-1">
                <object-form-field
                  v-if="hasProp(col.prop)"
                  :prop="col.prop"
                  :path="row.path"
                  :data="data"
                  :value="row.data"
                  :type="itemType"
                  :read-only="readOnly"
                  :registry="registry"
                  :settings="itemSettings"
                  @input="update"
                ></object-form-field>
                <div v-else>
                  {{ col.prop }} is missing settings.
                </div>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
      <tfoot v-if="hasPaging">
        <tr>
          <td :colspan="columns.length + 1" class="pt-3">
            <v-pagination
              v-bind="pagination"
              v-model="pageIndex"
              :length="pageCount"
            ></v-pagination>
          </td>
        </tr>
      </tfoot>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { Type, ListType, isNumber, ObjectType, TypeBuilder, isFunction, isString } from 'expangine-runtime';
import { LiveRuntime } from 'expangine-runtime-live';
import { TypeSettings, TypeSettingsRecord } from '../TypeVisuals';
import { ListSubs } from './ListTypes';
import { ListObjectTableOptions } from './ListObjectTableTypes';
import { getInput } from '@/app/Input';
import { sendNotification } from '@/app/Notify';
import { exportFile } from '@/app/FileExport';
import { getConfirmation } from '@/app/Confirm';
import { SystemEvents } from '@/app/SystemEvents';
import { getDataImportMapping } from '@/app/DataImport';
import { getDataExport } from '@/app/DataExport';
import ObjectFormField from '../object/ObjectFormField.vue';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListObjectTableOptions, object[], ListSubs>(Array).extend({
  name: 'ListObjectTable',
  components: {
    ObjectFormField,
  },
  data: () => ({
    pageIndex: 1,
    sortProp: null as null | string,
    sortDesc: false,
    changes: 1,
  }),
  computed: {
    itemType(): ObjectType {
      return this.type.options.item as ObjectType;
    },
    itemSettings(): TypeSettingsRecord<any, any> {
      return this.settings.sub.item as TypeSettingsRecord<any, any>;
    },
    itemName(): string {
      return this.settings.options.itemName || 'Item';
    },
    canSort(): boolean {
      return !this.settings.options.hideSort;
    },
    hasMenu(): boolean {
      return (this.canSort && (this.canSaveSort || this.canCancelSort)) || this.canAdd;
    },
    canExport(): boolean {
      return !this.settings.options.hideExport && this.isCsvType;
    },
    canImport(): boolean {
      return !this.settings.options.hideImport && this.isCsvType;
    },
    canSaveSort(): boolean {
      return !!this.sortProp;
    },
    canCancelSort(): boolean {
      return !!this.sortProp;
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
      if (this.data) {
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
    isCsvType(): boolean {
      return !!this.csvType && this.csvType.acceptsType(this.type);
    },
    csvType(): Type | null {
      if (!this.registry) {
        return null;
      }

      const simples = this.registry.defs.getSimpleTypes();
      const tp = new TypeBuilder();

      return tp.list(
        tp.object({
          '*': tp.many(
            tp.optional(tp.many(...simples)),
            ...simples,
          ),
        },
      ));
    },
    rowCount(): number {
      return this.changes ? this.value.length : 0;
    },
    columns(): any[] {
      return this.settings.options.columns;
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
    sortComparator(): false | ((a: any, b: any) => number) {
      const prop = this.sortProp;
      if (!prop) {
        return false;
      }
      const propType = this.itemType.options.props[prop];
      if (!propType) {
        return false;
      }
      const comparator = this.registry.getTypeCompare(propType);
      if (!comparator) {
        return false;
      }
      const command = LiveRuntime.getCommand(comparator);
      const multiplier = this.sortDesc ? -1 : 1;

      return (a, b) => command({ value: a[prop], test: b[prop] }) * multiplier;
    },
    sorted(): any[] {
      const comparator = this.sortComparator;

      if (!comparator) {
        return this.value;
      }
      
      const sorted = this.value.slice();
      sorted.sort(comparator);

      return sorted;
    },
    page(): any[] {
      const { sorted, pageStart, pageEnd, path } = this;

      return sorted.slice(pageStart, pageEnd)
        .map((data, index) => ({ data, path: path.concat([index + pageStart]) }))
      ;
    },
  },
  methods: {
    async removeAt(pageIndex: number) {
      const index = pageIndex + this.pageStart;
      if (!await getConfirmation()) {
        return;
      }

      if (this.data) {
        await this.data.remove(this.path.concat([index]));
        // TODO query
      } else {
        this.value.splice(index, 1);
        this.update();
      }
      this.changes++;
    },
    hasProp(prop: string): boolean {
      return prop in this.itemType.options.props;
    },
    canMove(pageIndex: number, dir: number) {
      const index = pageIndex + this.pageStart;
      const next = index + dir;

      return !this.data && next >= 0 && next < this.rowCount && !this.settings.options.hideSort;
    },
    moveTo(pageIndex: number, to: number) {
      const from = pageIndex + this.pageStart;
      const moving = this.value[from];
      this.value.splice(from, 1);
      this.value.splice(to, 0, moving);
      this.update();
      this.changes++;
    },
    move(pageIndex: number, dir: number) {
      this.moveTo(pageIndex, pageIndex + dir + this.pageStart);
    },
    insertAt(pageIndex: number) {
      const index = pageIndex + this.pageStart;
      this.value.splice(index, 0, this.itemType.fromJson(this.itemSettings.defaultValue));
      this.update();
      this.changes++;
    },
    async setItem(pageIndex: number, item: any) {
      const index = pageIndex + this.pageStart;
      if (this.data) {
        await this.data.set(this.path.concat([index]), item);
        // TODO query
      } else {
        this.$set(this.value, index, item);
      }
      this.update();
    },
    async addItem() {
      const item = this.itemType.fromJson(this.itemSettings.defaultValue);
      if (this.data) {
        await this.data.add(this.path, item);
        // TODO query
      } else {
        this.value.push(item);
        this.pageIndex = this.pageCount;
        this.update();
      }
      this.changes++;
    },
    getSortingIcon(prop: string) {
      return this.sortProp === prop
        ? this.sortDesc
          ? 'mdi-arrow-up'
          : 'mdi-arrow-down'
        : '';
    },
    sortToggle(prop: string) {
      if (!this.canSort) {
        return;
      }
      this.sortDesc = this.sortProp === prop ? !this.sortDesc : false;
      this.sortProp = this.sortProp === prop && !this.sortDesc ? null : prop;
    },
    async sortSave() {
      if (!await getConfirmation({ 
        message: 'Are you sure? The current order of elements will be the new default order of elements.',
      })) {
        return;
      }

      this.input(this.sorted);
      this.sortCancel();
    },
    sortCancel() {
      this.sortProp = null;
      this.sortDesc = false;
    },
    exportCsv() {
      SystemEvents.trigger('loading', async () => {
        const result = await getDataExport({
          namePrefix: this.settings.options.title,
          registry: this.registry,
          data: this.value,
          type: this.itemType,
        });

        if (isString(result)) {
          sendNotification({ message: result });
        }
      });
    },
    importCsv() {
      SystemEvents.trigger('loading', async () => {
        const result = await getDataImportMapping({
          registry: this.registry,
          type: this.itemType,
          typeSettings: this.itemSettings,
        });

        if (isString(result)) {
          return sendNotification({ message: result });
        }

        switch (result.action) {
          case 'append':
            if (this.data) {
              const all: Array<Promise<void>> = [];
              for (const value of result.data) {
                all.push(this.data.add(this.path, value));
              }
              await Promise.all(all);
              // TODO query
            } else {
              this.value.push(...result.data);
            }
            break;
        case 'replace':
            if (this.data) {
              await this.data.clear(this.path);
              const all: Array<Promise<void>> = [];
              for (const value of result.data) {
                all.push(this.data.add(this.path, value));
              }
              await Promise.all(all);
              // TODO query
            } else {
              this.value.splice(0, this.value.length, ...result.data);
            }
            break;
        }

        this.update();
      });
    },
  },
});
</script>