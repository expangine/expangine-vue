<template>
  <table class="ex-table ex-striped" v-shortcuts="objectShortcuts">
    <tbody>
      <tr>
        <td class="pl-0 pt-1">
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Object"
            tooltip="Create a dynamic Object"
          >
            <template #prepend>
              <v-list-item v-if="!readOnly" @click="addProperty">
                <v-list-item-content>
                  <v-list-item-title>
                    Add Property
                    <ex-shortcut-label pref="shortcut_object_add"></ex-shortcut-label>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Define a new property in the object
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="hasProperties" @click="toggleSort">
                <v-list-item-content>
                  <v-list-item-title>
                    Toggle Sort
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Re-order the properties with dragging
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </ex-expression-menu>
        </td>
        <td>
          <ex-draggable class="ex-table" 
            tag="table" 
            ghost-class="ex-ghost"
            handle=".ex-sorting-handle" 
            :class="{ 'ex-three': sorting, 'ex-read-only': readOnly }"
            v-model="keys"
          >
            <template v-for="(value, prop) in value.props">
              <tbody :key="prop">
                <tr>
                  <td v-if="sorting">
                    <v-icon class="ex-sorting-handle">mdi-drag-horizontal</v-icon>
                  </td>
                  <td class="var-name py-2">
                    <span v-if="readOnly">
                      {{ prop }} =
                    </span>
                    <v-text-field
                      v-else
                      outlined
                      dense
                      hide-details
                      append-outer-icon="mdi-equal"
                      :error="isPropertyInvalid(prop)"
                      :value="prop"
                      v-focus-on-create.last="'input'"
                      @change="changeProperty(prop, $event)"
                    ></v-text-field>
                  </td>
                  <td>
                    <ex-expression
                      v-bind="$props"
                      :required-type="null"
                      :value="value"
                      @input="changePropertyExpression(prop, $event)"
                      @remove="removeProperty(prop)"
                    ></ex-expression>
                  </td>
                </tr>
              </tbody>
            </template>
          </ex-draggable>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TypeMap, Expression, ExpressionMap, NoExpression, ObjectExpression, objectMap, objectValues, ObjectType, Traverser, GetExpression, SetExpression, UpdateExpression, ConstantExpression } from 'expangine-runtime';
import { obj, renameVariable } from '@/common';
import { Preferences } from '@/app/Preference';
import { ShortcutContext } from '@/app/Shortcuts';
import ExpressionBase from '../ExpressionBase';


const PREF_SHORTCUT_OBJECT_ADD = Preferences.define({
  key: 'shortcut_object_add',
  label: 'Add Object expression property shortcut',
  defaultValue: '187__c',
  component: 'ex-shortcut-input',
});


export default ExpressionBase<ObjectExpression>().extend({
  name: 'ObjectEditor',
  data: () => ({
    sorting: false,
  }),
  computed: {
    keys: {
      get(): string[] {
        return Object.keys(this.value.props);  
      },
      set(keys: string[]) {
        const props: ExpressionMap = obj();
        for (const key of keys) {
          props[key] = this.value.props[key];
        }
        this.value.props = props;
        this.update();
      },
    },
    hasProperties(): boolean {
      return this.keys.length > 1;
    },
    objectShortcuts(): ShortcutContext {
      return { 
        downs: {
          [Preferences.get(PREF_SHORTCUT_OBJECT_ADD)]: this.addProperty,
        },
      };
    },
  },
  mounted() {
    this.addIfEmpty();
  },
  methods: {
    addProperty(): void {
      this.$set(this.value.props, this.getNextPropertyName(), NoExpression.instance);
    },
    getNextPropertyName(): string {
      const names = 'abcdefghijklmnopqrstuvwxyz'.split('');
      let next = names.find((name) => !this.hasProperty(name));
      if (!next) {
        let index = 0;
        next = 'temp';
        while (this.hasProperty(next)) {
          next = 'temp' + index;
          index++;
        }
      }
      return next;
    },
    addIfEmpty(): void {
      if (Object.keys(this.value.props).length === 0) {
        this.addProperty();
      }
    },
    toggleSort() {
      this.sorting = !this.sorting;
    },
    hasProperty(name: string) {
      return !!(this.value && this.value.props && this.value.props[name]);
    },
    isPropertyInvalid(prop: string): boolean {
      return !prop;
    },
    changePropertyExpression(prop: string, expr: Expression): void {
      this.$set(this.value.props, prop, expr);
      this.update();
    },
    changeProperty(oldProp: string, newProp: string): void {
      const oldProps = this.value.props;
      const newProps: ExpressionMap = {};

      for (const currentProp in oldProps) {
        newProps[currentProp === oldProp 
          ? newProp 
          : currentProp] = oldProps[currentProp];
      }

      this.value.props = newProps;
      this.update();
    },
    removeProperty(prop: string): void {
      this.$delete(this.value.props, prop);
      this.update();
    },
  },
});
</script>

<style lang="less" scoped>
.var-name {
  min-width: 200px;
  padding: 0px !important;
  padding-right: 12px !important;
}
</style>