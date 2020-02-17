<template>
  <v-dialog persistent v-model="visible" max-width="400" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        {{ title }}
      </v-card-title>
      <v-card-text>

        <v-text-field
          outlined
          label="Name"
          :hint="nameHint"
          :error="invalidName"
          :disabled="propsOnly"
          v-focus-on-visible="[visible, 'input']"
          v-model="index.name"
        ></v-text-field>

        <v-simple-table v-if="index.props.length > 0">
          <colgroup>
            <col style="width: 48px;">
            <col style="width: 20%;">
            <col style="width: 40%;">
            <col style="width: 40%;">
            <col style="width: 24px;">
          </colgroup>
          <thead>
            <tr class="grey lighten-3">
              <th></th>
              <th>#</th>
              <th class="text-left">Property</th>
              <th class="text-left">Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(prop, index) in index.props">
              <tr :key="prop">
                <td>
                  <v-icon @click="move(index, -1)">mdi-arrow-up</v-icon>
                  <v-icon @click="move(index, 1)">mdi-arrow-down</v-icon>
                </td>
                <td class="text-center">{{ index }}</td>
                <td>{{ prop }}</td>
                <td>{{ getPropType(prop) }}</td>
                <td class="text-right">
                  <v-icon @click="remove(index)">mdi-delete</v-icon>
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>

        <v-select
          v-if="propsAvailable.length > 0"
          outlined
          hide-details
          class="mt-3"
          label="Add Property to Index"
          :items="propsAvailable"
          @change="addProp"
        ></v-select>

        <v-checkbox
          persistent-hint
          hint="The properties above must be unique for each instance"
          label="Unique?"
          :disabled="propsOnly"
          v-model="index.unique"
        ></v-checkbox>

        <v-checkbox
          v-if="index.primary"
          hide-details
          disabled
          label="Primary Key"
          v-model="index.primary"
        ></v-checkbox>

      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          :disabled="disableSave"
          v-html="confirm" 
          @click="handle(true)"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="secondary"
          v-html="unconfirm" 
          @click="handle(false)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ObjectType, Types, TypeStorage, TypeStoragePrimaryType, TypeIndex, objectEach, objectToArray } from 'expangine-runtime';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { editTypeIndexDialog } from './EditTypeIndex';
import { getConfirmation } from './Confirm';
import { Preferences, PreferenceCategory } from './Preference';


const PREF_REMOVE_TYPE_INDEX = Preferences.define({
  key: 'remove_type_index',
  label: 'Remove user-defined type indexes without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});


export default Vue.extend({
  data: () => editTypeIndexDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    title(): string {
      return this.name ? 'Edit Index' : 'Add Index';
    },
    nameHint(): string {
      return this.name && this.name !== this.index.name
        ? 'Previous name: ' + this.name
        : '';
    },
    props(): Array<{ text: string, value: string }> {
      return objectToArray(this.type.options.props, (type, name) => [name, type] as [string, Type])
        .filter(([name, type]) => this.propTypesAllowed.acceptsType(type))
        .map(([value, type]) => ({  value, text: value + ': ' + this.getTypeDescription(type) }))
      ;
    },
    propsAvailable(): Array<{ text: string, value: string }> {
      return this.props.filter(({ value }) => this.index.props.indexOf(value) === -1);
    },
    invalidName(): boolean {
      if (!this.index.name) {
        return true;
      }
      if (!this.storage) {
        return false;
      }
      const existing = this.storage.indexes[this.index.name];
      if (existing && existing !== this.index) {
        return true;
      }
      const primary = this.storage.getPrimary();
      if (primary && primary !== this.index && primary.name === this.index.name) {
        return true;
      }
      return false;
    },
    disableSave(): boolean {
      return this.invalidName || this.index.props.length === 0;
    },
  },
  methods: {
    getTypeDescription(type: Type) {
      return this.registry.getTypeDescribe(type);
    },
    getPropType(prop: string) {
      return prop in this.type.options.props
        ? this.getTypeDescription(this.type.options.props[prop])
        : '';
    },
    addProp(prop: string) {
      this.index.props.push(prop);
    },
    move(index: number, dir: number) {
      const props = this.index.props;
      const next = index + dir;
      if (index >= 0 && index < props.length) {
        const moving = props[index];
        props.splice(index, 1);
        props.splice(next, 0, moving);
      }
    },
    async remove(index: number) {
      if (await getConfirmation({ pref: PREF_REMOVE_TYPE_INDEX })) {
        this.index.props.splice(index, 1);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.v-dialog /deep/ table {
  table-layout: fixed; 
  border-spacing: 0;
  width: 100%;
}
</style>