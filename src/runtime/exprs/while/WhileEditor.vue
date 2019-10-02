<template>
  <table class="expression-table">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu 
            v-bind="$props"
            v-on="$listeners"
            text="While"
            tooltip="While this expression is true, execute the do expression"
          ></ex-expression-menu>
        </td>
        <td>
          <ex-expression
            v-bind="$props"
            type="condition"
            :value="value.condition"
            :required-type="conditionType"
            @input="updateCondition($event)"
            @remove="updateCondition()"
          ></ex-expression>
        </td>
      </tr>
      <tr>
        <td>
          <ex-chip-menu
            text="Do"
            tooltip="Execute this expression while the above expression is true"
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
      <tr>
        <td>
          <ex-chip-menu
            text="Break"
            tooltip="The name of the variable that can be set to TRUE to stop iteration at any point"
          ></ex-chip-menu>
        </td>
        <td>
          <v-text-field
            outlined
            hide-details
            v-model="value.breakVariable"
          ></v-text-field>
        </td>
      </tr>
      <tr>
        <td>
          <ex-chip-menu
            text="Max"
            tooltip="The maximum number of iterations to allow"
          ></ex-chip-menu>
        </td>
        <td>
          <v-text-field
            outlined
            hide-details
            type="number"
            v-model="value.maxIterations"
          ></v-text-field>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, WhileExpression, Expression, NoExpression, BooleanType } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<WhileExpression>().extend({
  name: 'DoEditor',
  computed: {
    bodyContext(): Type {
      return this.registry.defs.getContextWithScope(this.context, {
        [this.value.breakVariable]: BooleanType.baseType,
      }).context;
    },
  },
  methods: {
    updateCondition(condition?: Expression) {
      this.value.condition = condition || NoExpression.instance;
      this.update();
    },
    updateBody(body?: Expression) {
      this.value.body = body || NoExpression.instance;
      this.update();
    },
  },
});
</script>