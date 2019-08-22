<template>
  <div>
    <v-list-item>
      <v-list-item-avatar>
        <ex-type-editor-menu
          :type="type"
          :settings="settings"
          :registry="registry"
          :parent="parent"
          :read-only="readOnly"
          @input:type="updateType"
          @input:settings="updateSettings"
        ></ex-type-editor-menu>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          Object
        </v-list-item-title>
        <v-list-item-subtitle 
          v-html="summary"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-simple-table dense>
      <colgroup>
        <col style="width: 54px;">
        <col style="width: 150px;">
        <col style="width: 100%;">
      </colgroup>
      <thead>
        <tr>
          <th></th>
          <th class="text-right">Name</th>
          <th class="text-left pl-10">Type</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(propType, prop) in type.options.props">
          <tr :key="prop">
            <td class="cell-top pa-3">
              <v-btn icon @click="remove(prop)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </td>
            <td class="text-right border-right cell-top pa-5">
              <strong>{{ prop }}</strong>
            </td>
            <td class="pl-0">
              <ex-type-editor
                :type="propType"
                :parent="type"
                :registry="registry"
                :settings="settings.sub[prop]"
                :read-only="readOnly"
                @input="updateType"
              ></ex-type-editor>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot v-if="!readOnly">
        <tr>
          <td class="cell-top pa-3">
            <v-btn icon @click="add" :disabled="!isValidProp || !isValidType">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </td>
          <td class="border-right pa-1">
            <v-text-field
              solo
              hide-details
              class="text-right"
              placeholder="Name"
              v-model="addProp"
            ></v-text-field>
          </td>
          <td class="pa-1">
            <v-select
              solo
              hide-details
              placeholder="Type"
              :items="availableTypes"
              v-model="addType"
            ></v-select>
          </td>
        </tr>
      </tfoot>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { ObjectType } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { confirm } from '@/app/Confirm';
import { TypeVisuals } from '../../TypeVisuals';
import TypeEditorBase from '../TypeEditorBase';


export default TypeEditorBase<ObjectType, any>().extend({
  name: 'ObjectEditor',
  data: () => ({
    addProp: '',
    addType: null as null | TypeVisuals<ObjectType, true, any>,
  }),
  computed: {
    isValidProp(): boolean {
      return !!(this.addProp && !(this.addProp in this.type.options.props));
    },
    isValidType(): boolean {
      return !!this.addType;
    },
    availableTypes(): ListOptions<TypeVisuals | null> {
      const options: ListOptions<TypeVisuals | null> = this.registry.getBuildableTypeOptions();
      options.unshift({
        text: 'Type',
        value: null,
      });
      return options;
    },
  },
  methods: {
    add() {
      if (!this.addProp || !this.addType) {
        return;
      }

      const propName = this.addProp;
      const { type: propType, settings: propSettings } = this.addType.onBuild(this.type, this.settings);

      this.$set(this.type.options.props, propName, propType);
      if (!this.settings.sub) {
        this.$set(this.settings, 'sub', {});  
      }
      if (this.settings.sub) {
        this.$set(this.settings.sub, propName, propSettings);
      }

      this.addProp = '';
      this.addType = null;

      this.inputSelected.onSubAdd(propName, this.type, this.settings);

      this.updateType();
      this.updateSettings();
    },
    async remove(prop: string) {
      if (!await confirm()) {
        return;
      }

      this.inputSelected.onSubRemove(prop, this.type, this.settings);

      this.$delete(this.type.options.props, prop);
      if (this.settings.sub) {
        this.$delete(this.settings.sub, prop);
      }

      this.updateType();
      this.updateSettings();
    },
  },
});
</script>

<style scoped>
.v-data-table >>> table {
  table-layout: fixed;
}
.v-input.v-text-field--single-line >>> input {
  text-align: right;
}
.border-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.cell-top {
  vertical-align: top;
}
</style>
