<template>
  <span v-if="readOnly">{{ readonlyValue }}</span>
  <span v-else-if="inputType" class="pl-3">
    <ex-expression-menu
      v-bind="$props"
      v-on="$listeners"
      text="Const"
      tooltip="A constant value">
      <template #prepend>
        <v-list-item @click="edit">
          <v-list-item-content>
            Edit
          </v-list-item-content>
        </v-list-item>
      </template>
    </ex-expression-menu>
    <span class="pa-2">{{ readonlyValue }}</span>
    <v-dialog v-model="editing" persistent max-width="600px" style="display: inline">
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
  <span v-else>
    {{ readonlyValue }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, ConstantExpression, isArray, isObject } from 'expangine-runtime';
import { TypeSettings } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ConstantExpression>().extend({
  name: 'ConstantEditor',
  data: () => ({
    editing: false,
    editValue: null,
  }),
  computed: {
    inputType(): Type | null {
      return this.invalid && this.requiredType
        ? this.requiredType
        : this.computedType || this.requiredType;
    },
    readonlyValue(): string {
      if (!this.inputType) {
        return this.value.value + '';
      }
      const value = this.inputType.toJson(this.value.value);

      return isArray(value) || isObject(value)
        ? JSON.stringify(value)
        : value;
    },
    inputSettings(): TypeSettings | null {
      return this.pathSettings
        ? this.pathSettings
        : this.inputType 
          ? this.registry.getTypeDefaultSettings(this.inputType)
          : null;
    },
  },
  methods: {
    edit() {
      this.editValue = this.value.value;
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