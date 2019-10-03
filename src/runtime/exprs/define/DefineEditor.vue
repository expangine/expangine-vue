<template>
  <table class="expression-table striped">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Define"
            tooltip="Define multiple variables to be used in a sub-expression"
          >
            <template #prepend>
              <v-list-item @click="addVar">
                <v-list-item-content>
                  <v-list-item-title>
                    Add Variable
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Define a new variable to be used in the body
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="sortStart">
                <v-list-item-content>
                  <v-list-item-title>
                    Toggle Sort
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Re-order the definitions with dragging
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </ex-expression-menu>
        </td>
        <td>
          <ex-draggable class="expression-table" 
            tag="table" 
            ghost-class="ghost"
            handle=".sorting-handle" 
            :class="{ three: sorting }"
            v-model="vars" 
            @end="update">
            <template v-for="(pair, index) in vars">
              <tbody :key="index">
                <tr>
                  <td v-if="sorting">
                    <v-icon class="sorting-handle">mdi-drag-horizontal</v-icon>
                  </td>
                  <td class="var-name">
                    <v-text-field
                      outlined
                      hide-details
                      v-model="pair[0]"
                      @blur.native="saveVars"
                    ></v-text-field>
                  </td>
                  <td>
                    <ex-expression
                      v-bind="$props"
                      type="value"
                      :context="getContextAt(index)"
                      v-model="pair[1]"
                      @input="saveVars"
                      @remove="removeVar(pair[0])"
                    ></ex-expression>
                  </td>
                </tr>
              </tbody>
            </template>
          </ex-draggable>
        </td>
      </tr>
      <tr>
        <td>
            <ex-chip-menu
              text="Then"
              tooltip="Execute this expression with the available variables"
            ></ex-chip-menu>
          </td>
          <td>
            <ex-expression
              v-bind="$props"
              type="body"
              :value="value.body"
              :context="bodyContext"
              @input="updateBody($event)"
              @remove="updateBody()"
            ></ex-expression>
          </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TypeMap, Expression, ExpressionMap, NoExpression, DefineExpression, objectMap, objectValues, ObjectType } from 'expangine-runtime';
import { obj } from '@/common';
import { getConfirmation } from '../../../app/Confirm';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<DefineExpression>().extend({
  name: 'DefineEditor',
  data: () => ({
    sorting: false,
    vars: [] as Array<[string, Expression]>,
  }),
  computed: {
    bodyContext(): Type {
      return this.getContextAt(this.vars.length);
    },
  },
  watch: {
    'value.define': {
      immediate: true,
      handler(defines: ExpressionMap) {
        this.vars = objectValues(
          objectMap(this.value.define, (value, key) => 
            [key, value],
          ),
        );
      },
    },
  },
  methods: {
    sortStart() {
      this.sorting = !this.sorting;
    },
    updateBody(body?: Expression) {
      this.value.body = body || NoExpression.instance;
      this.update();
    },
    addVar() {
      this.vars.push([this.getNextVarName(), NoExpression.instance]);
    },
    getContextAt(index: number): Type {
      const defs = this.registry.defs;
      const scope = obj() as TypeMap;
      let context = this.context;

      for (let i = 0; i < index; i++) {
        const [name, expr] = this.vars[i];
        const exprType = expr.getType(defs, context);

        if (exprType) {
          scope[name] = exprType;
          context = defs.getContext(context, scope);
        }
      }

      return context;
    },
    getNextVarName() {
      const names = 'abcdefghijklmnopqrstuvwxyz'.split('');
      let next = names.find((name) => !this.value.define[name] && !this.hasContextVar(name));
      if (!next) {
        let index = 0;
        next = 'temp';
        while (this.hasVar(next)) {
          next = 'temp' + index;
          index++;
        }
      }
      return next;
    },
    hasVar(name: string) {
      return !!this.value.define[name] || this.hasContextVar(name);
    },
    hasContextVar(name: string) {
      return this.context instanceof ObjectType
        ? !!this.context.options.props[name]
        : false;
    },
    isVarInvalid(index: number): boolean {
      const [name, expr] = this.vars[index];

      return expr === NoExpression.instance
        || !name
        || this.hasContextVar(name)
        || !!this.vars.find(([other], otherIndex) => other === name && index !== otherIndex);
    },
    isVarsValid(): boolean {
      return !this.vars.find((pair, index) => this.isVarInvalid(index));
    },
    saveVars() {
      if (!this.isVarsValid()) {
        return;
      }

      const define = obj() as ExpressionMap;
      for (const [name, expr] of this.vars) {
        define[name] = expr;
      }

      this.value.define = define;
      this.update();
    },
    async removeVar(name: string) {
      this.$delete(this.value.define, name);
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