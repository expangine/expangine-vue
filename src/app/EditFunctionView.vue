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

    <v-tabs vertical icons-and-text background-color="grey lighten-3" v-model="tab">
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
      <v-tabs-items touchless v-model="tab">
        <v-tab-item>
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
        <v-tab-item>
          <ex-expression-editor
            :value="func.expression"
            :context="func.params"
            :registry="registry"
            :settings="settings"
            @input="onProgramChange"
          ></ex-expression-editor>
        </v-tab-item>
        <v-tab-item>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  outlined
                  hide-details
                  auto-grow
                  rows="5"
                  label="Description"
                  v-model="func.description"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-chip label>
                  Created:&nbsp;<timeago :datetime="func.created"></timeago>
                </v-chip>
                <v-chip label class="ml-4">
                  Updated:&nbsp;<timeago :datetime="func.updated"></timeago>
                </v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <ex-test-program
            :registry="registry"
            :program="func.expression"
            :input-type="func.params"
          ></ex-test-program>
        </v-tab-item>
        <v-tab-item>
          <v-simple-table v-if="hasTests">
            <colgroup>
              <col style="width: 48px;">
              <col style="width: 40%;">
              <col style="width: 60%;">
              <col style="width: 96px;">
            </colgroup>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="test in func.tests">
                <ex-func-test-row
                  :key="test.name"
                  :test="test"
                  :func="func"
                  :registry="registry"
                ></ex-func-test-row>
              </template>
            </tbody>
          </v-simple-table>
          <div class="text-center pa-3">
            <v-btn @click="addTest">
              <v-icon>mdi-plus</v-icon>
              Unit Test
            </v-btn>
          </div>
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
      </v-tabs-items>
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
import { Type, ObjectType, Expression, Traverser, ReturnExpression, Func, DefinitionsFunctionReference } from 'expangine-runtime';
import { TypeUpdateEvent } from '../runtime/types/TypeVisuals';
import { Preferences, PreferenceCategory } from './Preference';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';
import { Registry } from '../runtime/Registry';
import { sendNotification } from './Notify';
import { getFuncTest } from './FuncTest';



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
  data: () => ({
    tab: 0,
  }),
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
    hasTests(): boolean {
      return this.func.tests.length > 0 && this.tab === 4;
    },
  },
  methods: {
    renamed(newName: string) {
      const { registry, func } = this;
      const { defs } = registry;

      if (func.name) {
        const updates = defs.renameFunction(func.name, newName);

        if (updates && updates.length) {
          sendNotification({ message: `${updates.length} Function reference(s) updated.` });
        }
      } else {
        func.name = newName;

        defs.addFunction(func);
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
    async addTest() {
      const { func, registry } = this;

      const test = await getFuncTest({
        func,
        test: {
          name: '',
          description: '',
          args: func.params.create(),
          expected: null,
        },
        registry,
      });

      if (!test) {
        sendNotification({ message: 'Add Unit Test canceled.' });
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