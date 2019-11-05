<template>
  <span class="ex-center-aligned">
    <template v-for="(condition, index) in value.expressions">
      <span :key="index" class="ex-center-aligned">
        <span v-if="index > 0" class="ex-divider">AND</span>
        <ex-expression
          v-bind="$props"
          class="ex-parenthesis ex-inside"
          :value="condition"
          :required-type="conditionType"
          @input="updateExpression(index, $event)"
          @remove="updateExpression(index)"
        ></ex-expression>
      </span>
    </template>
    <v-menu>
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="addAnd">
          <v-list-item-content>
            <v-list-item-title>And</v-list-item-title>
            <v-list-item-subtitle>Add another condition</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="addOr">
          <v-list-item-content>
            <v-list-item-title>Or</v-list-item-title>
            <v-list-item-subtitle>Wrap the And in an Or</v-list-item-subtitle>
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
import { Expression, AndExpression, NoExpression, OrExpression, NotExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<AndExpression>().extend({
  name: 'AndEditor',
  methods: {
    addAnd() {
      this.value.expressions.push(NoExpression.instance);
      this.update();
    },
    addOr() {
      this.input(new OrExpression([this.value, NoExpression.instance]));
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