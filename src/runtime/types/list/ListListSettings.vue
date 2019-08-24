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
        label="Add Label"
        v-model="value.addLabel"
        @input="input"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-text-field
        filled
        label="Remove Label"
        v-model="value.removeLabel"
        @input="input"
      ></v-text-field>
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
