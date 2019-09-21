<template>
  <v-list>
    <v-list-item v-if="settings.options.title">
      <v-list-item-avatar class="mr-0">
        <v-tooltip>
          <template #activator="{ on }">
            <v-btn icon v-if="canAdd" v-on="on" @click="addItem">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Add {{ itemName }}</span>
        </v-tooltip>
      </v-list-item-avatar>
      <v-list-item-content>
        {{ settings.options.title }}
      </v-list-item-content>
    </v-list-item>
    <template v-for="(item, itemIndex) in value">
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
              <v-list-item v-if="canMove(itemIndex, 1)" @click="moveTo(itemIndex, value.length - 1)">
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
  </v-list>
</template>

<script lang="ts">
import { Type, ListType, isNumber } from 'expangine-runtime';
import { TypeSettings } from '../../TypeVisuals';
import { getConfirmation } from '../../../app/Confirm';
import { ListSubs } from './ListTypes';
import { ListListOptions } from './ListListTypes';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListListOptions, any[], ListSubs>(Array).extend({
  name: 'ListList',
  computed: {
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
        return this.value.length > this.type.options.min;
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
        return this.value.length < this.type.options.max;
      }
      return true;
    },
  },
  methods: {
    async removeAt(index: number) {
      if (!await getConfirmation()) {
        return;
      }

      this.value.splice(index, 1);
      this.update();
    },
    canMove(index: number, dir: number) {
      const next = index + dir;

      return next >= 0 && next < this.value.length && !this.settings.options.hideSort;
    },
    moveTo(from: number, to: number) {
      const moving = this.value[from];
      this.value.splice(from, 1);
      this.value.splice(to, 0, moving);
      this.update();
    },
    move(index: number, dir: number) {
      this.moveTo(index, index + dir);
    },
    insertAt(index: number) {
      this.value.splice(index, 0, this.itemType.fromJson(this.itemSettings.defaultValue));
      this.update();
    },
    setItem(index: number, item: any) {
      this.$set(this.value, index, item);
      this.update();
    },
    addItem() {
      this.value.push(this.itemType.fromJson(this.itemSettings.defaultValue));
      this.update();
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
