<template>
  <div class="ex-edit-entity-index">
    <ex-namer
      v-if="!hideName"
      auto-validate
      :validate="validateName"
      :value="index.name"
      @input="renamed"
      @remove="remove"
    ></ex-namer>

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
              <v-icon @click="moveProp(index, -1)">mdi-arrow-up</v-icon>
              <v-icon @click="moveProp(index, 1)">mdi-arrow-down</v-icon>
            </td>
            <td class="text-center">{{ index }}</td>
            <td>{{ prop }}</td>
            <td>{{ getPropType(prop) }}</td>
            <td class="text-right">
              <v-icon @click="removeProp(index)">mdi-delete</v-icon>
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
      @change="save"
    ></v-checkbox>

    <v-checkbox
      v-if="index.primary"
      hide-details
      disabled
      label="Primary Key"
      v-model="index.primary"
      @change="save"
    ></v-checkbox>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ObjectType, Types, EntityIndex, objectEach, objectToArray, Entity } from 'expangine-runtime';
import { TypeSettings } from '@/runtime/types/TypeVisuals';
import { editTypeIndexTypes } from './EditEntityIndex';
import { getConfirmation } from './Confirm';
import { Preferences, PreferenceCategory } from './Preference';
import { Registry } from '../runtime/Registry';


const PREF_REMOVE_TYPE_INDEX = Preferences.define({
  key: 'remove_type_index',
  label: 'Remove user-defined type indexes without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    entity: {
      type: Object as () => Entity,
      required: true,
    },
    index: {
      type: Object as () => EntityIndex,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    propsOnly: {
      type: Boolean,
      default: false,
    },
    propTypesAllowed: {
      type: Object as () => Type,
      default: () => editTypeIndexTypes,
    },
    hideName: {
      type: Boolean,
      default: false,
    },
  },
  computed: {    
    props(): Array<{ text: string, value: string }> {
      return objectToArray(this.entity.type.options.props, (type, name) => [name, type] as [string, Type])
        .filter(([name, type]) => this.propTypesAllowed.acceptsType(type))
        .map(([value, type]) => ({  value, text: value + ': ' + this.getTypeDescription(type) }))
      ;
    },
    propsAvailable(): Array<{ text: string, value: string }> {
      return this.props.filter(({ value }) => this.index.props.indexOf(value) === -1);
    },
  },
  methods: {
    renamed(newName: string) {
      const { entity, index } = this;
      const oldName = index.name;

      index.name = newName;
      Vue.delete(entity.indexes, index.name);
      Vue.set(entity.indexes, newName, index);

      this.$emit('renamed', index);
    },
    async remove() {
      const { entity, index } = this;

      if (await getConfirmation({ pref: PREF_REMOVE_TYPE_INDEX })) {
        Vue.delete(entity.indexes, index.name);

        this.$emit('removed');
      }
    },
    getTypeDescription(type: Type) {
      return this.registry.getTypeDescribe(type);
    },
    getPropType(prop: string) {
      return prop in this.entity.type.options.props
        ? this.getTypeDescription(this.entity.type.options.props[prop])
        : '';
    },
    addProp(prop: string) {
      this.index.props.push(prop);
      this.save();
    },
    moveProp(index: number, dir: number) {
      const props = this.index.props;
      const next = index + dir;
      if (index >= 0 && index < props.length) {
        const moving = props[index];
        props.splice(index, 1);
        props.splice(next, 0, moving);
      }
      this.save();
    },
    async removeProp(index: number) {
      this.index.props.splice(index, 1);
      this.save();
    },
    save() {
      const { entity, index } = this;

      Vue.set(entity.indexes, index.name, index);

      this.$emit('saved', index);
    },
    validateName(name: string) {
      if (!name) {
        return 'A name is required.';
      }

      const existing = this.entity.indexes[name];
      if (existing && existing !== this.index) {
        return 'An index already exists with that name.';
      }

      return '';
    },
  },
});
</script>

<style lang="less" scoped>
.ex-edit-entity-index /deep/ table {
  table-layout: fixed; 
  border-spacing: 0;
  width: auto;
}
</style>