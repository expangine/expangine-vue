<template>
  <div>
    <ex-namer
      v-if="!hideName"
      auto-validate
      :validate="validateName"
      :value="func.name"
      @input="renamed"
      @remove="remove"
    ></ex-namer>

    <v-tabs vertical icons-and-text background-color="grey lighten-3">
      <v-tab>
        <v-icon>mdi-file-tree</v-icon>
        Parameters
      </v-tab>
      <v-tab>
        <v-icon>mdi-code-braces</v-icon>
        Program
      </v-tab>
      <v-tab>
        <v-icon>mdi-information-outline</v-icon>
        Info
      </v-tab>
      <v-tab>
        <v-icon>mdi-calculator</v-icon>
        Test
      </v-tab>
      <v-tab>
        <v-icon>mdi-format-list-checks</v-icon>
        Unit Tests
      </v-tab>
      <v-tab>
        <v-icon>mdi-swap-horizontal-bold</v-icon>
        Refs
      </v-tab>
      <v-tab-item class="data-container">
        <ex-type-editor
          hide-settings
          no-transform
          :type="func.params"
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
          :value="func.expression"
          :context="func.params"
          :registry="registry"
          :settings="settings"
          @input="onProgramChange"
        ></ex-expression-editor>
      </v-tab-item>
      <v-tab-item>
        <v-textarea
          outlined
          rows="5"
          label="Description"
          class="ma-3"
          v-model="func.description"
        ></v-textarea>
      </v-tab-item>
      <v-tab-item>
        <ex-test-program
          :registry="registry"
          :program="func.expression"
          :input-type="func.params"
        ></ex-test-program>
      </v-tab-item>
      <v-tab-item>
        Unit Tests!
      </v-tab-item>
      <v-tab-item>
        <p v-if="references.length === 0" class="pa-3">
          <v-alert type="info">
            This Function is not referenced by anything.
          </v-alert>
        </p>
        <v-list dense v-else>
          <template v-for="(ref, index) in references">
            <ex-definitions-reference 
              :key="index"
              :reference="ref" 
              :registry="registry"
            ></ex-definitions-reference>
          </template>
        </v-list>
      </v-tab-item>
    </v-tabs>

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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, NoExpression, ObjectType, Expression, Traverser, ReturnExpression, Func, Types, DefinitionsFunctionReference } from 'expangine-runtime';
import { TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { Preferences, PreferenceCategory } from './Preference';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';
import { Registry } from '../runtime/Registry';
import { sendNotification } from './Notify';


const PREF_REMOVE_FUNCTION = Preferences.define({
  key: 'function_remove',
  label: 'Remove function without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    func: {
      type: Object as () => Func,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
    requiredParamsType: {
      type: Object as () => Type,
      default: () => ObjectType.baseType,
    },
    hideName: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    settings() {
      return this.registry.getTypeSettings(this.func.params);
    },
    hasValidParams(): boolean {
      return this.requiredParamsType.acceptsType(this.func.params);
    },
    hasReturn(): boolean {
      return 0 < this.func.expression.traverse(
        Traverser.count<Expression>().filterClass(ReturnExpression),
      );
    },
    references(): DefinitionsFunctionReference[] {
      return this.registry.defs.getFunctionReferences(this.func);
    },
  },
  methods: {
    renamed(newName: string) {
      const { registry, func } = this;
      const { defs } = registry;

      if (func.name) {
        const updates = this.registry.defs.renameFunction(func.name, newName);

        if (updates && updates.length) {
          sendNotification({ message: `${updates.length} Function reference(s) updated.` });
        }
      } else {
        func.name = newName;

        this.registry.defs.addFunction(func);
      }
    },
    validateName(name: string) {
      if (!name) {
        return 'A name is required.';
      }

      const existing = this.registry.defs.getFunction(name);
      if (existing && existing !== this.func) {
        return 'A function already exists with that name.';
      }

      return '';
    },
    async remove() {
      const refs = this.registry.defs.getFunctionReferences(this.func.name).length;

      if (!await getConfirmation({ message: `Are you sure you want to remove this function? It is referenced ${refs} times.`, pref: PREF_REMOVE_FUNCTION })) {
        return;
      }

      if (!this.registry.defs.removeFunction(this.func.name)) {
        sendNotification({ message: 'You cannot remove a referenced function. '});
      } else {
        this.$emit('remove', this.func);
      }
    },
    onChange(event: TypeUpdateEvent) {
      this.func.params = event.type as ObjectType;
      this.func.meta = event.settings;

      if (event.transform) {
        this.func.refactor(event.transform, LiveRuntime);
      }
    },
    onProgramChange(program: Expression) {
      this.func.expression = program;
    },
    onArgumentRemove(arg: string) {
      this.registry.defs.removeFunctionParameter(this.func.name, arg);
    },
    onArgumentRename([oldProp, newProp]: [string, string]) {
      this.registry.defs.renameFunctionParameter(this.func.name, oldProp, newProp);
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