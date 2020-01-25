<template>
  <span class="pl-0">

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

    <span class="pa-2" v-if="enumeratedLabel">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-chip 
            v-on="on" 
            v-html="enumeratedLabel"
            color="#00000022"
          ></v-chip>
        </template>
        <ex-data-string
          class="pa-2"
          html
          single-line
          :registry="registry"
          :data="value.value"
          :type="computedType"
        ></ex-data-string>
      </v-tooltip>
    </span>

    <ex-data-string
      v-else
      class="pa-2"
      html
      single-line
      :registry="registry"
      :data="value.value"
      :type="computedType"
    ></ex-data-string>

    <v-dialog v-if="editing" :value="true" persistent max-width="600px" class="d-inline" :fullscreen="isFullscreen">
      <v-card>
        <v-card-title>
          <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
            <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
            <v-icon v-else>mdi-fullscreen</v-icon>
          </v-btn>
          
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
import { Type, AnyType, TextType, ObjectType, EnumType, ColorType, ColorSpaceRGB, ConstantExpression, isArray, isObject, compare, copy } from 'expangine-runtime';
import { TypeSettings } from '../../types/TypeVisuals';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ConstantExpression>().extend({
  name: 'ConstantEditor',
  data: () => ({
    editing: false,
    editValue: null,
    fullscreen: false,
  }),
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    invalid(): boolean {
      return this.isInvalid(this.value.value);
    },
    inputType(): Type | null {
      return this.requiredType || AnyType.baseType;
    },
    enumeratedType(): EnumType | null {
      return this.computedType instanceof EnumType
        ? this.computedType
        : this.requiredType instanceof EnumType
          ? this.requiredType
          : null;
    },
    enumeratedLabel(): string | null {
      const type = this.enumeratedType;
      if (!type) {
        return null;
      }

      for (const [label, value] of type.options.constants.entries()) {
        if (compare(value, this.value.value) === 0) {
          return label;
        }
      }

      return null;
    },
    inputSettings(): TypeSettings | null {
      return this.registry.getTypeSettingsValidFor(this.inputType, this.pathSettings)
        ? this.pathSettings
        : this.inputType 
          ? this.registry.getTypeSettings(this.inputType)
          : null;
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
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
      if (isObject(this.editValue)) {
        this.editValue = copy(this.editValue);
      }
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

<style lang="less" scoped>
/deep/ .color-square {
  display: inline-block;
  width: 11px;
  height: 11px;
  top: 2px;
  position: relative;
  margin-right: 3px;
  margin-top: -2px;
}
</style>