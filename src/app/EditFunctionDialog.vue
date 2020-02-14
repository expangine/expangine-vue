<template>
  <v-dialog persistent v-model="visible" max-width="1000" :fullscreen="isFullscreen">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
        <v-btn icon v-if="isFullscreenToggleVisible" @click="toggleFullscreen">
          <v-icon v-if="fullscreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>

        Edit Function

        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="test">
          Test
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          outlined
          hide-details
          label="Save As"
          :error="invalidSaveAs"
          v-focus-on-visible="[visible, 'input']"
          v-model="saveAs"
        ></v-text-field>

        <v-tabs>
          <v-tab>Input</v-tab>
          <v-tab>Program</v-tab>
          <v-tab-item class="data-container">
            <ex-type-editor
              hide-settings
              no-transform
              :type="func.options.params"
              :required-type="requiredParamsType"
              :registry="registry"
              :settings="settings"
              @change="onChange"
              @prop:remove="onArgumentRemove"
              @prop:rename="onArgumentRename"
            ></ex-type-editor>
          </v-tab-item>
          <v-tab-item class="data-container">
            <ex-expression-editor
              :value="func.options.expression"
              :context="func.options.params"
              :registry="registry"
              :settings="settings"
              @input="onProgramChange"
            ></ex-expression-editor>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          color="primary"
          @click="cancel"
        >Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-alert 
          v-if="!hasValidParams"
          dense
          type="error"
          class="mb-0 mr-3"
        >Your function parameters must be an object.</v-alert>
        <v-alert 
          v-else-if="!hasReturn"
          dense
          type="error"
          class="mb-0 mr-3"
        >Your function is missing a return statement.</v-alert>
        <v-btn 
          color="primary"
          :disabled="disableSave"
          @click="save"
        >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { NoExpression, ObjectType, Expression, Traverser, ReturnExpression } from 'expangine-runtime';
import { TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { editFunctionDialog } from './EditFunction';
import { getTestFunction } from './TestFunction';
import { removeFunctionArgument, renameFunctionArgument } from './Refactor';


export default Vue.extend({
  data: () => editFunctionDialog,
  computed: {
    isFullscreen(): boolean {
      return this.$vuetify.breakpoint.mdAndDown || this.fullscreen;
    },
    isFullscreenToggleVisible(): boolean {
      return !this.$vuetify.breakpoint.mdAndDown;
    },
    invalidSaveAs(): boolean {
      if (!this.saveAs) {
        return true;
      }
      const existing = this.registry.defs.functions[this.saveAs];
      if (existing && existing !== this.func) {
        return true;
      }

      return !this.registry.isValidFunction(this.saveAs);
    },
    disableSave(): boolean {
      return this.func.options.expression === NoExpression.instance;
    },
    hasValidParams(): boolean {
      return this.requiredParamsType.acceptsType(this.func.options.params);
    },
    hasReturn(): boolean {
      return 0 < this.func.options.expression.traverse(
        Traverser.count<Expression>().filterClass(ReturnExpression),
      );
    },
  },
  methods: {
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    cancel() {
      this.close(false);
    },
    save() {
      this.close(true);
    },
    onChange(event: TypeUpdateEvent) {
      this.func.options.params = event.type as ObjectType;
    },
    onProgramChange(program: Expression) {
      this.func.options.expression = program;
    },
    test() {
      const { registry, func, name } = this;

      getTestFunction({ registry, func, name });
    },
    onArgumentRemove(arg: string) {
      if (this.name) {
        removeFunctionArgument(this.name, arg);
      }
    },
    onArgumentRename([oldProp, newProp]: [string, string]) {
      if (this.name) {
        renameFunctionArgument(this.name, oldProp, newProp);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.data-container {
  position: relative;
  height: inherit;
  overflow: scroll;
}
</style>