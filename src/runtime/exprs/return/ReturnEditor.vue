<template>
  <span class="ex-center-aligned">

    <ex-expression-menu
      key="menu"
      v-bind="$props"
      v-on="$listeners"
      text="Return"
      tooltip="Exit the expression now, optionally returning a value"
      class="mt-1"
      :can-remove="canRemoveReturn"
    >
      <template #prepend>
        <v-list-item v-if="!canRemoveReturn" @click="removeReturn">
          <v-list-item-content>
            <v-list-item-title>
              Remove Return
            </v-list-item-title>
            <v-list-item-subtitle>
              Replace return with the value it is returning
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </ex-expression-menu>

    <ex-expression
      key="value"
      v-bind="$props"
      class="ex-inside ex-parenthesis"
      :value="value.value"
      :required-type="null"
      @input="updateValue($event)"
      @remove="updateValue()"
    ></ex-expression>
    
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, ChainExpression, ReturnExpression, ExpressionBuilder, NoExpression } from 'expangine-runtime';
import ExpressionBase from '../ExpressionBase';
import { getConfirmation } from '../../../app/Confirm';


export default ExpressionBase<ReturnExpression>().extend({
  name: 'ReturnEditor',
  computed: {
    canRemoveReturn(): boolean {
      return this.value.value === NoExpression.instance;
    },
  },
  methods: {
    updateValue(expr?: Expression) {
      this.value.value = expr || NoExpression.instance;
      this.update();
    },
    async removeReturn() {
      if (await getConfirmation()) {
        this.input(this.value.value);
      }
    },
  },
});
</script>