<template>
  <v-autocomplete
    hide-details
    outlined
    clearable
    append-icon="mdi-close"
    :menu-props="{ maxWidth: 400 }"
    :label="searchLabel"
    :items="searchItems"
    :filter="filterOperation"
    @input="chooseOperation"
    @click:append="cancel">
    <template #item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-html="item.text"></v-list-item-title>
        <v-list-item-subtitle v-html="item.description"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, Type, OperationExpression, OperationPair, NoExpression, Operation, OperationTypes, Traverser, GetExpression, ConstantExpression, isArray, UpdateExpression, SetExpression } from 'expangine-runtime';
import { ListOptions } from '@/common';
import { filterOperation, getListOption, sortListOption } from './helpers';
import ExpressionBase from '../ExpressionBase';


const STARTING_PARAM = '$wrapped';

export default ExpressionBase<OperationExpression>().extend({
  name: 'OperationSearch',
  computed: {
    filterOperation: () => filterOperation,
    searchLabel(): string {
      return this.returnTypeMode
        ? this.returnTypeDescribed
        : this.forTypeMode
          ? this.forTypeDescribed
          : 'Operation';
    },
    searchItems(): ListOptions<OperationPair> {
      return this.returnTypeMode
        ? this.returnTypeOperations
        : this.forTypeMode
          ? this.forTypeOperations
          : this.allOperations;
    },
    startingValue(): Expression | null {
      return this.value.params[STARTING_PARAM] || null;
    },
    startingValueType(): Type | null {
      return this.startingValue
        ? Type.simplify(this.startingValue.getType(this.registry.defs, this.context))
        : null;
    },
    hasStartingValue(): boolean {
      return !!this.startingValue;
    },
    returnTypeDescribed(): string {
      return this.requiredType
        ? 'Operation for ' + this.registry.getTypeDescribe(this.requiredType)
        : 'Operation';
    },
    returnTypeMode(): boolean {
      return !!this.requiredType && !this.hasStartingValue;
    },
    returnTypeOperations(): ListOptions<OperationPair> {
      return this.requiredType
        ? this.registry.defs
          .getOperationsWithReturnType(this.requiredType)
          .map((pair) => getListOption(this.registry, pair))
          .sort(sortListOption)
        : [];
    },
    forTypeMode(): boolean {
      return this.hasStartingValue;
    },
    forTypeDescribed(): string {
      return this.startingValueType
        ? 'Operation for ' + this.registry.getTypeDescribe(this.startingValueType)
        : 'Operation';
    },
    forTypeOperations(): ListOptions<OperationPair> {
      return this.startingValueType
        ? this.registry.defs
          .getOperationsForType(this.startingValueType)
          .map((pair) => getListOption(this.registry, pair))
          .sort(sortListOption)
        : [];
    },
    allOperations(): ListOptions<OperationPair> {
      return this.registry.defs.getOperations()
        .map((pair) => getListOption(this.registry, pair))
        .sort(sortListOption)
      ;
    },
  },
  methods: {
    cancel() {
      if (this.startingValue) {
        this.input(this.startingValue);
      } else {
        this.remove();
      }
    },
    chooseOperation(pair: OperationPair) {
      const startingValue = this.startingValue;
      const params = this.value.params;

      this.value.name = pair.op.id;

      if (startingValue) {
        const startName = pair.op.params[0];
        this.$set(params, startName, startingValue);
        this.$delete(params, STARTING_PARAM);
      }

      for (const param of pair.op.params) {
        if (!params[param]) {
          this.$set(params, param, NoExpression.instance);
        }
      }

      this.update();
    },
  },
});
</script>