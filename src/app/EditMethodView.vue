<template>
  <div>
    <ex-namer
      auto-validate
      :validate="validateName"
      :value="method.name"
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
            :type="method.params"
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
            :value="method.expression"
            :context="methodContext"
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
            v-model="method.description"
          ></v-textarea>
        </v-tab-item>
        <v-tab-item>
          <ex-test-program
            :registry="registry"
            :program="method.expression"
            :input-type="methodContext"
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
              <template v-for="test in method.tests">
                <ex-func-test-row
                  :key="test.name"
                  :test="test"
                  :func="method"
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
              This Method is not referenced by anything.
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
    >Your method parameters must be an object.</v-alert>
    <v-alert 
      v-else-if="!hasReturn"
      dense
      type="error"
      class="mb-0 mr-3"
    >Your method is missing a return statement.</v-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Entity, Types, Type, ObjectType, Expression, Traverser, ReturnExpression, Func, DefinitionsFunctionReference } from 'expangine-runtime';
import { TypeUpdateEvent, TypeSettings } from '../runtime/types/TypeVisuals';
import { Preferences, PreferenceCategory } from './Preference';
import { LiveRuntime } from 'expangine-runtime-live';
import { getConfirmation } from './Confirm';
import { Registry } from '../runtime/Registry';
import { sendNotification } from './Notify';
import { getFuncTest } from './FuncTest';



const PREF_REMOVE_METHOD = Preferences.define({
  key: 'method_remove',
  label: 'Remove method without confirmation',
  category: [PreferenceCategory.CONFIRM],
  defaultValue: false,
});

export default Vue.extend({
  props: {
    method: {
      type: Object as () => Func,
      required: true,
    },
    entity: {
      type: Object as () => Entity,
      required: true,
    },
    registry: {
      type: Object as () => Registry,
      required: true,
    },
  },
  data: () => ({
    tab: 0,
    requiredParamsType: Types.object() as Type,
  }),
  computed: {
    settings(): TypeSettings<any> {
      return this.registry.getTypeSettings(this.methodContext);
    },
    hasValidParams(): boolean {
      return this.requiredParamsType.acceptsType(this.method.params);
    },
    hasReturn(): boolean {
      return 0 < this.method.expression.traverse(
        Traverser.count<Expression>().filterClass(ReturnExpression),
      );
    },
    references(): DefinitionsFunctionReference[] {
      return this.registry.defs.getMethodReferences(this.entity, this.method);
    },
    hasTests(): boolean {
      return this.method.tests.length > 0 && this.tab === 4;
    },
    methodContext(): Type {
      return this.registry.defs.getContextWithScope(this.method.params, {
        [Expression.INSTANCE]: this.entity.type,
      }).context;
    },
  },
  methods: {
    renamed(newName: string) {
      const { registry, method, entity } = this;
      const { defs } = registry;

      if (method.name) {
        const updates = defs.renameMethod(entity.name, method.name, newName);

        if (updates && updates.length) {
          sendNotification({ message: `${updates.length} Method reference(s) updated.` });
        }
      } else {
        method.name = newName;

        defs.addMethod(entity, method);
      }
    },
    validateName(name: string) {
      if (!name) {
        return 'A name is required.';
      }

      const existing = this.entity.methods[name];
      if (existing && existing !== this.method) {
        return 'A method already exists with that name.';
      }

      return '';
    },
    async remove() {
      const { registry, method, entity } = this;
      const { defs } = registry;

      const refs = defs.getMethodReferences(entity, method).length;

      if (!await getConfirmation({ message: `Are you sure you want to remove this method? It is referenced ${refs} times.`, pref: PREF_REMOVE_METHOD })) {
        return;
      }

      if (!defs.removeMethod(entity, method)) {
        sendNotification({ message: 'You cannot remove a referenced method. '});
      } else {
        this.$emit('remove', method);
      }
    },
    async addTest() {
      const { method: func, registry } = this;

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
      this.method.params = event.type as ObjectType;
      this.method.meta = event.settings;

      if (event.transform) {
        this.method.refactor(event.transform, LiveRuntime);
      }
    },
    onProgramChange(program: Expression) {
      this.method.expression = program;
    },
    onArgumentRemove(arg: string) {
      const { registry, method, entity } = this;
      const { defs } = registry;

      defs.removeMethodParameter(entity, method, arg);
    },
    onArgumentRename([oldProp, newProp]: [string, string]) {
      const { registry, method, entity } = this;
      const { defs } = registry;

      defs.renameMethodParameter(entity, method, oldProp, newProp);
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