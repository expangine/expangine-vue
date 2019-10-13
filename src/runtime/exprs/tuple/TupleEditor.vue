<template>
  <table class="expression-table striped">
    <tbody>
      <tr>
        <td>
          <ex-expression-menu
            v-bind="$props"
            v-on="$listeners"
            class="mr-3"
            text="Tuple"
            tooltip="Creates a dynamic Tuple"
          >
            <template #prepend>
              <v-list-item @click="toggleSort">
                <v-list-item-content>
                  <v-list-item-title>
                    Toggle Sort
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Re-order the elements with dragging
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </ex-expression-menu>
        </td>
        <td>
          <ex-draggable 
            tag="table"
            handle=".sorting-handle"
            ghost-class="ghost"
            :class="{ 'expression-table striped': sorting }"
            v-model="value.expressions"
            @end="update">
            <template v-for="(expr, index) in value.expressions">
              <tbody :key="index">
                <tr class="tuple-row">
                  <td v-if="sorting">
                    <v-icon class="sorting-handle">mdi-drag-horizontal</v-icon>
                  </td>
                  <td class="py-2">
                    <ex-expression
                      v-bind="$props"
                      type="value"
                      :key="index"
                      :value="expr"
                      :required-type="null"
                      @input="updateExpression(index, $event)"
                      @remove="updateExpression(index)"
                    ></ex-expression>
                  </td>
                </tr>
              </tbody>
            </template>
            <tbody v-if="!readOnly">
              <tr class="tuple-row">
                <td v-if="sorting"></td>
                <td class="py-2">
                  <ex-expression
                    v-bind="$props"
                    type="value"
                    :value="noop"
                    :required-type="null"
                    @input="addExpression"
                  ></ex-expression>
                </td>
              </tr>
            </tbody>
          </ex-draggable>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import { Type, Expression, TupleExpression, NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';


export default ExpressionBase<TupleExpression>().extend({
  name: 'TupleEditor',
  data: () => ({
    sorting: false,
  }),
  computed: {
    noop(): Expression {
      return NoExpression.instance;
    },
  },
  methods: {
    toggleSort(): void {
      this.sorting = !this.sorting;
    },
    addExpression(expr: Expression) {
      this.value.expressions.push(expr);
    },
    updateExpression(index: number, expr?: Expression) {
      if (expr) {
        this.$set(this.value.expressions, index, expr);
      } else {
        this.value.expressions.splice(index, 1);
      }

      this.update();
    },
  },
});
</script>

<style lang="less" scoped>
.tuple-row {
  height: auto;
}
</style>