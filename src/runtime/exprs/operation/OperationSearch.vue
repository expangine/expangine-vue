<template>
  <v-autocomplete
    hide-details
    outlined
    clearable
    no-filter
    append-icon="mdi-close"
    :menu-props="{ maxWidth: 400 }"
    :label="searchLabel"
    :items="searchItems"
    :search-input.sync="query"
    v-focus-on-visible="[true, 'input']"
    @input="chooseOperation"
    @click:append="cancel">
    <template #item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-html="item.text"></v-list-item-title>
        <v-list-item-subtitle 
          :title="item.description"
          v-html="item.description"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template #append-outer>
      <v-tooltip top v-if="canIgnoreType">
        <template #activator="{ on }">
          <v-btn icon color="error" @click="toggleIgnoreType" v-on="on">
            <v-icon>mdi-filter</v-icon>
          </v-btn>
        </template>
        Remove Type Restrictions from Search
      </v-tooltip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Expression, Type, OperationExpression, OperationPair, NoExpression, Types } from 'expangine-runtime';
import { ListOptionsTokenized } from '@/common';
import { filterOperation, getListOption, sortListOption, sortListOptionByCount } from './helpers';
import ExpressionBase from '../ExpressionBase';


const STARTING_PARAM = '$wrapped';

export default ExpressionBase<OperationExpression>().extend({
  name: 'OperationSearch',
  data: () => ({
    query: '',
    ignoreType: false,
  }),
  computed: {
    searchLabel(): string {
      return this.returnTypeMode
        ? this.returnTypeDescribed
        : this.forTypeMode
          ? this.forTypeDescribed
          : 'Operation';
    },
    searchItems(): ListOptionsTokenized<OperationPair> {
      let items = this.returnTypeMode
        ? this.returnTypeOperations
        : this.forTypeMode
          ? this.forTypeOperations
          : this.allOperations;

      if (this.query) {
        items = items.filter((item) => filterOperation(item, this.query, item.text));
        items.sort(sortListOptionByCount(this.query));
      } else {
        items.sort(sortListOption);
      }

      return items;
    },
    canIgnoreType(): boolean {
      return !this.ignoreType && (this.returnTypeMode || this.forTypeMode);
    },
    startingValue(): Expression | null {
      return this.value.params[STARTING_PARAM] || null;
    },
    startingValueType(): Type | null {
      return this.startingValue
        ? Types.simplify(this.startingValue.getType(this.registry.defs, this.context))
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
      return false;
      // return !!this.requiredType && !this.hasStartingValue; // no return type mode
    },
    returnTypeOperations(): ListOptionsTokenized<OperationPair> {
      return this.requiredType
        ? this.registry.defs
          .getOperationsWithReturnType(this.requiredType, {}, true)
          .filter((pair) => this.registry.isValidOperation(pair, this.requiredType, this.startingValueType))
          .map((pair) => getListOption(this.registry, pair))
        : [];
    },
    forTypeMode(): boolean {
      return this.hasStartingValue && !this.ignoreType;
    },
    forTypeDescribed(): string {
      return this.startingValueType
        ? 'Operation for ' + this.registry.getTypeDescribe(this.startingValueType)
        : 'Operation';
    },
    forTypeOperations(): ListOptionsTokenized<OperationPair> {
      return this.startingValueType
        ? this.registry.defs
          .getOperationsForType(this.startingValueType, true)
          .filter((pair) => this.registry.isValidOperation(pair, this.requiredType, this.startingValueType))
          .map((pair) => getListOption(this.registry, pair))
        : [];
    },
    allOperations(): ListOptionsTokenized<OperationPair> {
      return this.registry.defs.getOperations()
        .filter((pair) => this.registry.isValidOperation(pair))
        .map((pair) => getListOption(this.registry, pair))
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
    toggleIgnoreType() {
      this.ignoreType = !this.ignoreType;
    },
    chooseOperation(pair: OperationPair) {
      const startingValue = this.startingValue;
      const params = this.value.params;
      const visuals = this.registry.getOperationVisuals(pair.op.id);

      this.value.name = pair.op.id;

      if (startingValue) {
        const startName = pair.op.params[0];
        this.$set(params, startName, startingValue);
        this.$delete(params, STARTING_PARAM);
      }

      if (visuals.initialParams) {
        const initial = visuals.initialParams(this.context, this.registry);
        for (const param in initial) {
          if (!params[param]) {
            this.$set(params, param, initial[param]);
          }
        }
      }

      for (const param of pair.op.params) {
        if (!params[param]) {
          this.$set(params, param, NoExpression.instance);
        }
      }

      pair.op.scope.forEach((scope) => {
        let alias = scope;
        let aliasCount = 0;
        while (this.hasContextVar(alias)) {
          alias = scope + ++aliasCount;
        }
        if (alias !== scope) {
          this.$set(this.value.scopeAlias, scope, alias);
        }
      });

      this.update();
    },
  },
});
</script>

<style lang="less" scoped>
.v-autocomplete {

  /deep/ .v-input__append-outer {
    margin-top: 8px;
    margin-left: 2px;
  }
}
</style>