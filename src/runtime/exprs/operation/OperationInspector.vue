<template>
  <v-dialog v-model="visible" width="1000">
    <v-card v-if="visible">
      <v-card-text>

        <p class="display-1 text--primary pa-2 pt-4">
          {{ operationName }}  

          <v-chip class="float-right mt-2" :color="operationComplexityColor">
            Complexity: {{ operationComplexity }}
          </v-chip>
        </p>
        
        <v-sheet class="text--primary pa-3 mb-3" elevation="2">
          {{ operationDescription }}
        </v-sheet>

        <h2 class="mt-5">Returns</h2>

        <p 
          v-if="operationVisuals.returnComments"
          v-html="operationVisuals.returnComments"
          class="pa-2 mt-2"
        ></p>

        <code class="d-block pa-2 mt-2 scrollable" 
          v-if="returnType"
          v-html="describeType(returnType)"
        ></code>
        <div v-else>
          Unknown Type
        </div>

        <h2 class="mt-5">Parameters</h2>

        <ul class="ma-5">
          <li><strong>Parameter</strong>: The name of the operation value, required values are denoted with a <span class="red--text text--darken-4">*</span>.</li>
          <li><strong>Expected Type</strong>: The type that is needed for this expression. If the expected type is exactly same as the current type that means the operation types are dynamic.</li>
          <li><strong>Current Type</strong>: The type detected in the given expression.</li>
          <li><strong>Comment</strong>: Explanation of the parameter.</li>
          <li><strong>Mutates</strong>: If Yes, that means the value returned by the expression will be changed.</li>
          <li><strong>Has Scope?</strong>: If Yes, that means new variables are added to the scope so the expression can use them to generate a value. Scoped expressions can be called once or multiple times with different values depending on the operation.</li>
        </ul>

        <v-simple-table class="fixed-table">
          <colgroup>
            <col style="width: 100px">
            <col style="width: 30%;">
            <col style="width: 30%;">
            <col style="width: 40%;">
            <col style="width: 80px">
            <col style="width: 100px">
            <col style="width: 100px">
          </colgroup>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Expected Type</th>
              <th>Current Type</th>
              <th>Comment</th>
              <th>Mutates</th>
              <th>Has Scope?</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="param in operation.params">
              <tr :key="param">
                <td class="nowrap" :title="param">
                  {{ param }} 
                  <span class="red--text text--darken-4">*</span>
                </td>
                <td>
                  <code class="d-block pa-2 ma-1 scrollable" 
                    v-html="describeType(paramTypes[param])"
                  ></code>
                </td>
                <td class="scrollable">
                  <code class="d-block pa-2 ma-1 scrollable" 
                    v-if="value.params[param]"
                    v-html="describeType(paramActual(param))"
                  ></code>
                </td>
                <td>
                  {{ operationVisuals.comments[param] }}
                </td>
                <td class="text-center">
                  <div v-if="operation.mutates.indexOf(param) + 1">
                    Yes
                  </div>
                </td>
                <td class="text-center">
                  <div v-if="operation.hasScope.indexOf(param) + 1">
                    Yes
                  </div>
                </td>
                <td class="text-center">
                </td>
              </tr>
            </template>
            <template v-for="param in operation.optional">
              <tr :key="param">
                <td class="nowrap" :title="param">
                  {{ param }}
                </td>
                <td class="scrollable">
                  <code class="d-block pa-2 ma-1 scrollable" 
                    v-html="describeType(paramTypes[param])"
                  ></code>
                </td>
                <td class="scrollable">
                  <code class="d-block pa-2 ma-1 scrollable" 
                    v-if="value.params[param]"
                    v-html="describeType(paramActual(param))"
                  ></code>
                </td>
                <td>
                  {{ operationVisuals.comments[param] }}
                </td>
                <td class="text-center">
                  <div v-if="operation.mutates.indexOf(param) + 1">
                    Yes
                  </div>
                </td>
                <td class="text-center">
                  <div v-if="operation.hasScope.indexOf(param) + 1">
                    Yes
                  </div>
                </td>
                <td class="text-center">
                  <div v-if="operationVisuals.defaults">
                    {{ operationVisuals.defaults[param] }}
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>

        <div v-if="operation.scope.length">

          <h2 class="mt-5">Scope</h2>

          <ul class="ma-5">
            <li><strong>Var</strong>: The name of the value added to the scope.</li>
            <li><strong>Type</strong>: The type of the value added to the scope.</li>
            <li><strong>Comment</strong>: Explanation of the value.</li>
          </ul>

          <v-simple-table class="fixed-table">
            <colgroup>
              <col style="width: 100px">
              <col style="width: 50%;">
              <col style="width: 50%;">
            </colgroup>
            <thead>
              <tr>
                <th>Var</th>
                <th>Type</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="param in operation.scope">
                <tr :key="param">
                  <td class="nowrap" :title="param">
                    {{ param }}
                  </td>
                  <td class="scrollable">
                    <code class="d-block pa-2 ma-1 scrollable" 
                      v-html="describeType(scopeType(param))"
                    ></code>
                  </td>
                  <td>
                    {{ operationVisuals.scopeComments[param] }}
                  </td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
        </div>

      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn text @click="visible = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>        
</template>

<script lang="ts">
import Vue from 'vue';
import { Expression, Type, TypeMap, OperationExpression, OperationPair, NoExpression, Operation, OperationTypes, Traverser, GetExpression, ConstantExpression, isArray, UpdateExpression, SetExpression } from 'expangine-runtime';
import { OperationVisuals } from '../../ops/OperationVisuals';
import OperationSearch from './OperationSearch.vue';
import ExpressionBase from '../ExpressionBase';


const COMPLEXITY_LABELS = [
  'Low',
  'Medium',
  'High',
  'Very High',
];
const COMPLEXITY_LABEL_MAX = 'Too High';
const COMPLEXITY_COLORS = [
  'green',
  'yellow',
  'orange',
  'red darken-4',
];
const COMPLEXITY_COLOR_MAX = 'black';


export default ExpressionBase<OperationExpression>().extend({
  name: 'OperationInspector',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    inspecting: false,
  }),
  computed: {
    visible: {
      get(): boolean {
        return this.show;
      },
      set(value: boolean) {
        this.$emit('update:show', value);
      },
    },
    operation(): Operation<any, any, any, any, any> | null {
      return this.registry.defs.getOperation(this.value.name);
    },
    operationTypes(): OperationTypes<any, any, any> | null {
      return this.registry.defs.getOperationTypes(this.value.name);
    },
    operationVisuals(): OperationVisuals {
      return this.registry.getOperationVisuals(this.value.name);
    },
    operationName(): string {
      return this.operationVisuals.name;
    },
    operationDescription(): string {
      return this.operationVisuals.description;
    },
    complexity(): number {
      return this.value.getComplexity(this.registry.defs);
    },
    operationComplexity(): string {
      return COMPLEXITY_LABELS[Math.round(this.complexity)] || COMPLEXITY_LABEL_MAX;
    },
    operationComplexityColor(): string {
      return COMPLEXITY_COLORS[Math.round(this.complexity)] || COMPLEXITY_COLOR_MAX;
    },
    paramTypes(): TypeMap {
      return this.registry.defs.getOperationExpectedTypes(this.value.name, this.value.params, this.value.scopeAlias, this.context);
    },
    returnType(): Type | null {
      return this.operationTypes 
        ? this.registry.defs.getOperationInputType(this.operationTypes.returnType, this.paramTypes)
        : null;
    },
  },
  methods: {
    describeType(type?: Type): string {
      return type ? this.registry.getTypeDescribeLong(type, '&nbsp;&nbsp;', '<br>') : '';
    },
    paramActual(name: string): Type | null {
      const paramExpr = this.value.params[name];
      if (!paramExpr) {
        return null;
      }

      const paramType = paramExpr.getType(this.registry.defs, this.paramContext(name));
      if (!paramType) {
        return null;
      }

      return Type.simplify(paramType);
    },
    scopeType(name: string): Type | null {
      return this.operationTypes
        ? this.registry.defs.getOperationInputType(this.operationTypes.scope[name], this.paramTypes)
        : null;
    },
    paramContext(name: string): Type {
      const defs = this.registry.defs;
      const op = this.operation;
      const opTypes = this.operationTypes;

      if (op && opTypes && op.hasScope.indexOf(name) !== -1) 
      {
        return this.scopedContext();
      }

      return this.context;
    },
    scopedContext(): Type {
      const defs = this.registry.defs;
      const op = this.operation;
      const opTypes = this.operationTypes;

      if (!op || !opTypes)
      {
        return this.context;
      }

      const { context, scope } = defs.getContextWithScope(this.context);

      for (const scopeParam of op.scope) 
      {
        const scopeType = defs.getOperationInputType(opTypes.scope[scopeParam], this.paramTypes);

        if (scopeType) 
        {
          const alias = this.value.scopeAlias[scopeParam] || scopeParam;

          scope[alias] = scopeType.getSimplifiedType();
        }
      }

      return context;
    },
  },
});
</script>

<style lang="less" scoped>
.fixed-table /deep/ table {
  table-layout: fixed;
  
  .scrollable {
    white-space: nowrap;
    overflow: scroll;
  }

  .nowrap {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>