<template>
  <v-list>
    <v-list-item v-if="settings.options.title">
      <v-list-item-avatar class="mr-0">
      </v-list-item-avatar>
      <v-list-item-content>
        {{ settings.options.title }}
      </v-list-item-content>
    </v-list-item>
    <template v-for="(item, itemIndex) in value">
      <v-list-item :key="itemIndex">
        <v-list-item-avatar class="mr-0">
          <v-btn icon @click="removeAt(itemIndex)">
            <v-tooltip bottom>
              <template #activator="{ on }">
                <v-icon v-on="on">mdi-minus</v-icon>
              </template>
              <span>{{ removeLabel }}</span>
            </v-tooltip>
          </v-btn>
        </v-list-item-avatar>
        <v-list-item-content class="list-item">
          <ex-type-input
            :value="item"
            :type="type.options.item"
            :read-only="readOnly"
            :registry="registry"
            :settings="settings.sub.item"
            @input="setItem(itemIndex, $event)"
          ></ex-type-input>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-list-item>
      <v-list-item-avatar class="mr-0">
        <v-btn icon @click="addItem">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon v-on="on">mdi-plus</v-icon>
            </template>
            <span>{{ addLabel }}</span>
          </v-tooltip>
        </v-btn>
      </v-list-item-avatar>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { ListType, copy } from 'expangine-runtime';
import { ListListOptions, ListListSubs } from './ListListTypes';
import { confirm } from '../../../app/Confirm';
import TypeInputBase from '../TypeInputBase';


export default TypeInputBase<ListType, ListListOptions, any[], ListListSubs>(Array).extend({
  name: 'ListList',
  computed: {
    addLabel(): string { 
      return this.settings.options.addLabel || 'Add Item';
    },
    removeLabel(): string {
      return this.settings.options.removeLabel || 'Remove Item';
    },
  },
  methods: {
    async removeAt(index: number) {
      if (!await confirm()) {
        return;
      }

      this.value.splice(index, 1);
      this.update();
    },
    setItem(index: number, item: any) {
      this.$set(this.value, index, item);
      this.update();
    },
    addItem() {
      this.value.push(copy(this.settings.sub.item.defaultValue));
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
