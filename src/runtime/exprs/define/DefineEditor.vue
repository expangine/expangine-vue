<template>
  <table class="ex-table ex-striped">
    <tbody>
      <tr>
        <td class="pl-0 pt-1">
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Define"
            tooltip="Define multiple variables to be used in a sub-expression"
          >
            <template #prepend>
              <template v-if="!readOnly">
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
                <v-list-item @click="toggleSort">
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
            </template>
          </ex-expression-menu>
        </td>
        <td>
          <ex-draggable class="ex-table" 
            tag="table" 
            ghost-class="ex-ghost"
            handle=".ex-sorting-handle" 
            :class="{ 'ex-three': sorting, 'ex-read-only': readOnly }"
            v-model="value.define" 
            @end="update"
          >
            <template v-for="(pair, index) in value.define">
              <tbody :key="index">
                <tr>
                  <td v-if="sorting">
                    <v-icon class="ex-sorting-handle">mdi-drag-horizontal</v-icon>
                  </td>
                  <td class="var-name py-2">
                    <span v-if="readOnly">
                      {{ pair[0] }}
                      <span class="px-3">=</span>
                    </span>
                    <v-text-field
                      v-else
                      dense
                      outlined
                      hide-details
                      append-outer-icon="mdi-equal"
                      class="mr-2"
                      :error="isVarInvalid(index)"
                      :value="pair[0]"
                      @change="changeVar(index, $event)"
                    ></v-text-field>
                  </td>
                  <td>
                    <ex-expression
                      v-bind="$props"
                      :context="getContextAt(index)"
                      :required-type="null"
                      :value="pair[1]"
                      @input="changeVarExpression(index, $event)"
                      @remove="removeVar(index)"
                    ></ex-expression>
                  </td>
                </tr>
              </tbody>
            </template>
          </ex-draggable>
        </td>
      </tr>
      <tr>
        <td class="pt-1">
          <ex-chip-menu
            text="Then"
            tooltip="Execute this expression with the available variables"
          ></ex-chip-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
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
import { Type, TypeMap, Expression, ExpressionMap, NoExpression, DefineExpression, objectMap, objectValues, ObjectType, Traverser, GetExpression, SetExpression, UpdateExpression, ConstantExpression } from 'expangine-runtime';
import { obj, renameVariable } from '@/common';
import { getConfirmation } from '../../../app/Confirm';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<DefineExpression>().extend({
  name: 'DefineEditor',
  data: () => ({
    sorting: false,
  }),
  computed: {
    bodyContext(): Type {
      return this.getContextAt(this.value.define.length);
    },
  },
  methods: {
    toggleSort(): void {
      this.sorting = !this.sorting;
    },
    updateBody(body?: Expression): void {
      this.value.body = body || NoExpression.instance;
      this.update();
    },
    addVar(): void {
      this.value.define.push([this.getNextVarName(), NoExpression.instance]);
    },
    getContextAt(index: number): Type {
      const defs = this.registry.defs;
      const scope = obj() as TypeMap;
      let context = this.context;

      for (let i = 0; i < index; i++) {
        const [name, expr] = this.value.define[i];
        const exprType = expr.getType(defs, context);

        if (exprType) {
          scope[name] = exprType;
          context = defs.getContext(context, scope);
        }
      }

      return context;
    },
    getNextVarName(): string {
      const names = 'abcdefghijklmnopqrstuvwxyz'.split('');
      let next = names.find((name) => !this.hasVar(name));
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
      return this.value.define.some(([n]) => n === name) || this.hasContextVar(name);
    },
    isVarInvalid(index: number): boolean {
      const [name, expr] = this.value.define[index];

      return expr === NoExpression.instance
        || !name
        || this.hasContextVar(name)
        || this.value.define.some(([other], otherIndex) => other === name && index !== otherIndex);
    },
    isVarsValid(): boolean {
      return !this.value.define.some((pair, index) => this.isVarInvalid(index));
    },
    changeVarExpression(index: number, expr?: Expression): void {
      this.$set(this.value.define[index], 1, expr || NoExpression.instance);
      this.update();
    },
    changeVar(index: number, newName: string): void {
      const oldName = this.value.define[index][0];
      const skipRenaming = this.isVarInvalid(index);

      this.$set(this.value.define[index], 0, newName);

      if (skipRenaming) {
        return;
      }

      if (oldName && oldName !== newName) {
        renameVariable(this.value.body, oldName, newName);

        for (let i = index + 1; i < this.value.define.length; i++) {
          renameVariable(this.value.define[i][1], oldName, newName);
        }
      }

      this.update();
    },
    removeVar(index: number): void {
      this.value.define.splice(index, 1);
      this.update();
    },
  },
});
</script>

<style lang="less" scoped>
.var-name {
  min-width: 200px;
  padding: 0px !important;
}
</style>