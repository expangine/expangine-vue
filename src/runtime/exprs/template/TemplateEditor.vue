<template>
  <table class="ex-table">
    <tbody>
      <tr>
        <td class="pl-0">
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="Template"
            tooltip="Template multiple variables to be used in a sub-expression"
          ></ex-expression-menu>
        </td>
        <td>
          <span v-if="readOnly">
            {{ value.template }}
          </span>
          <v-text-field
            v-else
            dense
            outlined
            persistent-hint
            hint="Text with {vars} embedded in it that {can} be replaced"
            v-model="value.template"
            v-focus-on-create="'input'"
            @blur="addDefinedVars"
          ></v-text-field>
        </td>
      </tr>
      <template v-for="(param, name) in value.params">
        <tr :key="name">
          <td class="pa-0">
            <span v-if="readOnly">
              {{ name }}
            </span>
            <v-text-field
              v-else
              dense
              outlined
              hide-details
              :value="name"
              :readonly="!isVarInvalid(name)"
              :error="isVarInvalid(name)"
              @input="renameVar(name, $event)"
            ></v-text-field>
          </td>
          <td>
            <span v-if="readOnly">&nbsp;=&nbsp;</span>
            <v-icon class="ma-2" v-else>mdi-equal</v-icon>

            <ex-expression
              v-bind="$props"
              :value="param"
              :required-type="paramType"
              @input="saveVar(name, $event)"
              @remove="removeVar(name)"
            ></ex-expression>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, TypeMap, Expression, ExpressionMap, NoExpression, TemplateExpression, objectMap, objectValues, ObjectType, TypeBuilder } from 'expangine-runtime';
import { obj } from '@/common';
import { getConfirmation } from '../../../app/Confirm';
import ExpressionBase from '../ExpressionBase';
import { Preferences } from '../../../app/Preference';


const tp = new TypeBuilder();
const PREF_REMOVE_VAR = Preferences.define({
  key: 'template_remove_var',
  label: 'Remove Template expression vars without confirmation',
  defaultValue: false,
});


export default ExpressionBase<TemplateExpression>().extend({
  name: 'TemplateEditor',
  data: () => ({
    vars: [] as string[],
  }),
  computed: {
    paramType(): Type {
      return tp.many(
        tp.text(), 
        tp.number(), 
        tp.enum(tp.many(tp.text(), tp.number()), tp.any()),
      );
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(template: string) {
        this.parseVars();
      },
    },
  },
  methods: {
    parseVars(): string[] {
      this.vars = this.value.template
        .split(/[\}\{}]/)
        .filter((v, i) => (i % 2) === 1)
        .filter((v) => v)
      ;

      return this.vars;
    },
    addDefinedVars() {
      const oldVars = this.vars;
      const newVars = this.parseVars();

      const common = obj();
      for (const oldVar of oldVars) {
        if (newVars.indexOf(oldVar) !== -1) {
          common[oldVar] = true;
        }
      }

      const params = this.value.params;

      let oldIndex = 0;
      for (const newVar of newVars) {
        if (!common[newVar]) {
          while (oldIndex < oldVars.length && common[oldVars[oldIndex]]) {
            oldIndex++;
          }
          if (oldIndex < oldVars.length) {
            const oldVar = oldVars[oldIndex];
            if (!params[newVar]) {
              this.$set(params, newVar, params[oldVar]);
              this.$delete(params, oldVar);
            }
          }
        }
      }
      
      for (const varName of newVars) {
        if (!params[varName]) {
          this.$set(params, varName, NoExpression.instance);
        }
      }
    },
    isVarInvalid(name: string): boolean {
      return !!this.value.params[name] && this.vars.indexOf(name) === -1;
    },
    saveVar(name: string, expr: Expression) {
      this.$set(this.value.params, name, expr);
      this.update();
    },
    renameVar(name: string, newName: string) {
      const params = this.value.params;
      const expr = params[name];
      this.$delete(params, name);
      if (newName) {
        this.$set(params, newName, expr);
      }
      this.addDefinedVars();
      this.update();
    },
    async removeVar(name: string) {
      if (await getConfirmation({ pref: PREF_REMOVE_VAR })) {
        this.$delete(this.value.params, name);
        this.addDefinedVars();
        this.update();
      }
    },
  },
});
</script>