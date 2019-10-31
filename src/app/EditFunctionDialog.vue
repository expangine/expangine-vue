<template>
  <v-dialog v-model="visible" max-width="1000">
    <v-card v-if="visible">
      <v-card-title class="headline mb-2">
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
          v-model="saveAs"
        ></v-text-field>

        <v-tabs>
          <v-tab>Input</v-tab>
          <v-tab>Program</v-tab>
          <v-tab-item class="data-container">
            <ex-type-editor
              hide-settings
              :type="func.options.params"
              :required-type="requiredParamsType"
              :registry="registry"
              :settings="settings"
              @change="onChange"
            ></ex-type-editor>
          </v-tab-item>
          <v-tab-item class="data-container">
            <ex-expression
              :value="func.options.expression"
              :context="func.options.params"
              :registry="registry"
              :settings="settings"
              @input="onProgramChange"
            ></ex-expression>
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


export default Vue.extend({
  data: () => editFunctionDialog,
  computed: {
    invalidSaveAs(): boolean {
      if (!this.saveAs) {
        return true;
      }
      const existing = this.registry.defs.functions[this.saveAs];

      return existing && existing !== this.func;
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
  },
});
</script>

<style lang="less" scoped>
.data-container {
  position: relative;
  height: calc(100vh - 350px);
  overflow: scroll;
}
</style>