<template>
  <ex-draggable class="expression-table striped" v-model="value.chain" tag="table" handle=".sorting-handle" @end="update" ghost-class="ghost">
    <template v-for="(expr, index) in value.chain">
      <tbody :key="index">
        <tr>
          <td>
            <v-icon class="sorting-handle">mdi-drag-horizontal</v-icon>
          </td>
          <td>
            <ex-expression
              v-bind="$props"
              type="body"
              :key="index"
              :value="expr"
              :required-type="getRequiredType(index)"
              @input="updateExpression(index, $event)"
              @remove="updateExpression(index)"
            ></ex-expression>
          </td>
        </tr>
      </tbody>
    </template>
    <tbody v-if="!readOnly">
      <tr>
        <td></td>
        <td>
          <ex-expression
            v-bind="$props"
            :value="noop"
            @input="addExpression"
          ></ex-expression>
        </td>
      </tr>
    </tbody>
  </ex-draggable>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, ChainExpression, NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<ChainExpression>().extend({
  name: 'BodyEditor',
  computed: {
    noop(): Expression {
      return NoExpression.instance;
    },
  },
  methods: {
    addExpression(expr: Expression) {
      this.value.chain.push(expr);
    },
    updateExpression(index: number, expr?: Expression) {
      if (expr) {
        this.$set(this.value.chain, index, expr);
      } else {
        this.value.chain.splice(index, 1);
      }

      const n = this.value.chain.length;

      if (n === 1) {
        this.input(this.value.chain[0]);
      } else if (n === 0) {
        this.remove();
      } else {
        this.update();
      }
    },
    getRequiredType(index: number): Type | null {
      return index === this.value.chain.length - 1
        ? this.requiredType
        : null;
    },
  },
});
</script>