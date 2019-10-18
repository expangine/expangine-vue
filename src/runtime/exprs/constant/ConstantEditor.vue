<template>
  <span v-if="readOnly">
    {{ readonlyValue }}
  </span>
  <span v-else :class="inOperationClass">

    <ex-expression-menu
      v-bind="$props"
      v-on="$listeners"
      :invalid-override="invalid"
      text="Const"
      tooltip="A constant value">
      <template #prepend>
        <v-list-item @click="edit">
          <v-list-item-content>
            <v-list-item-title>Edit</v-list-item-title>
            <v-list-item-subtitle>Set the constant value</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </ex-expression-menu>

    <span class="pa-2" v-html="readonlyValue"></span>

    <v-dialog v-if="editing" :value="true" persistent max-width="600px" class="d-inline">
      <v-card>
        <v-card-title>
          <span class="headline">Enter Value</span>
        </v-card-title>
        <v-card-text>
          <ex-type-input
            :registry="registry"
            :value="value.value"
            :type="inputType"
            :settings="inputSettings"
            v-model="editValue"
          ></ex-type-input>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="secondary" text @click="editCancel">Close</v-btn>
          <v-btn color="primary" text @click="editSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, AnyType, TextType, ObjectType, ConstantExpression, isArray, isObject } from 'expangine-runtime';
import { TypeSettings } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';


const TAB = '';
const NEWLINE = '&nbsp;&nbsp;';
const PROCESS = (value: any, type: Type) => {
  if (type instanceof TextType) {
    value = '"' + value + '"';
  }
  return value;
};

export default ExpressionBase<ConstantExpression>().extend({
  name: 'ConstantEditor',
  data: () => ({
    editing: false,
    editValue: null,
  }),
  computed: {
    invalid(): boolean {
      return this.isInvalid(this.value.value);
    },
    inputType(): Type | null {
      return this.requiredType || AnyType.baseType;
    },
    readonlyValue(): string {
      return this.invalid || !this.computedType
        ? JSON.stringify(this.value.value)
        : this.registry.getTypeToString(this.value.value, this.computedType, TAB, NEWLINE, '', PROCESS);
    },
    inputSettings(): TypeSettings | null {
      return this.pathSettings
        ? this.pathSettings
        : this.inputType 
          ? this.registry.getTypeSettings(this.inputType)
          : null;
    },
  },
  methods: {
    isInvalid(value: any) {
      return !!(this.requiredType && !this.requiredType.isValid(value));
    },
    edit() {
      this.editValue = this.value.value;
      if (this.isInvalid(this.editValue) && this.requiredType && this.inputSettings) {
        this.editValue = this.requiredType.fromJson(this.inputSettings.defaultValue);
      }
      this.editing = true;
    },
    editSave() {
      this.value.value = this.editValue;
      this.editing = false;
      this.update();
    },
    editCancel() {
      this.editing = false;
    },
  },
});
</script>