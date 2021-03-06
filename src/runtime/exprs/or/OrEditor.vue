<template>
  <span class="ex-center-aligned">
    <template v-for="(condition, index) in value.expressions">
      <span :key="index" class="ex-center-aligned">
        <span v-if="index > 0">
          <ex-expression-menu
            v-bind="$props"
            text="Or"
            tooltip="Return true if any of the conditions are true"
            @remove="remove"
            @input="input"
          ></ex-expression-menu>
        </span>
        <ex-expression
          v-bind="$props"
          class="ex-inside ex-parenthesis"
          :value="condition"
          :required-type="conditionType"
          @input="updateExpression(index, $event)"
          @remove="updateExpression(index)"
        ></ex-expression>
      </span>
    </template>
    <v-menu v-if="!readOnly">
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="addOr">
          <v-list-item-content>
            <v-list-item-title>Or</v-list-item-title>
            <v-list-item-subtitle>Add another condition</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="addAnd">
          <v-list-item-content>
            <v-list-item-title>And</v-list-item-title>
            <v-list-item-subtitle>Wrap the Or in an And</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="addNot">
          <v-list-item-content>
            <v-list-item-title>Not</v-list-item-title>
            <v-list-item-subtitle>Wrap the Or in a Not</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, OrExpression, NoExpression, AndExpression, NotExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<OrExpression>().extend({
  name: 'OrEditor',
  methods: {
    addAnd() {
      this.input(new AndExpression([this.value, NoExpression.instance]));
    },
    addOr() {
      this.value.expressions.push(NoExpression.instance);
      this.update();
    },
    addNot() {
      this.input(new NotExpression(this.value));
    },
    updateExpression(index: number, expr?: Expression) {
      if (expr) {
        this.$set(this.value.expressions, index, expr);
      } else {
        this.value.expressions.splice(index, 1);
      }

      const n = this.value.expressions.length;

      if (n === 1) {
        this.input(this.value.expressions[0]);
      } else if (n === 0) {
        this.remove();
      } else {
        this.update();
      }
    },
  },
});
</script>