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
      <v-text-field
        filled
        hide-details
        label="Item Name"
        v-model="value.itemName"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Hide Remove"
        v-model="value.hideRemove"
        @change="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Hide Insert"
        v-model="value.hideInsert"
        @change="input"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        hide-details
        label="Hide Sort"
        v-model="value.hideSort"
        @change="input"
      ></v-checkbox>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { ListType } from 'expangine-runtime';
import { ListListOptions } from './ListListTypes';
import TypeSettingsBase from '../TypeSettingsBase';


export default TypeSettingsBase<ListType, ListListOptions>().extend({
  name: 'ListListSettings',
});
</script>

<style lang="sass" scoped>

</style>
